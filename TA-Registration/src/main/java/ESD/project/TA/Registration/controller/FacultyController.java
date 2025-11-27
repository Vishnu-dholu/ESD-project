package ESD.project.TA.Registration.controller;

import ESD.project.TA.Registration.dto.AssignTADto;
import ESD.project.TA.Registration.dto.CreateCourseDto;
import ESD.project.TA.Registration.entity.Course;
import ESD.project.TA.Registration.entity.TAAssignment;
import ESD.project.TA.Registration.entity.User;
import ESD.project.TA.Registration.exception.DuplicateResourceException;
import ESD.project.TA.Registration.exception.ResourceNotFoundException;
import ESD.project.TA.Registration.exception.UnauthorizedException;
import ESD.project.TA.Registration.exception.ValidationException;
import ESD.project.TA.Registration.repo.CourseRepository;
import ESD.project.TA.Registration.repo.TAAssignmentRepository;
import ESD.project.TA.Registration.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final TAAssignmentRepository taAssignmentRepository;

    /** Get logged-in faculty */
    private User getLoggedInFaculty(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null)
            throw new UnauthorizedException("Not authenticated");

        String email;

        if (auth.getPrincipal() instanceof OidcUser oidcUser) {
            email = oidcUser.getEmail();
        } else {
            email = auth.getName();
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found for " + email));
    }

    /** 1) Get ONLY this faculty’s courses */
    @GetMapping("/my-courses")
    public List<Course> getMyCourses(Authentication auth) {
        User faculty = getLoggedInFaculty(auth);
        return courseRepository.findByFaculty_Id(faculty.getId());
    }

    /** 2) Add new course under logged-in faculty */
    @PostMapping("/add-course")
    public ResponseEntity<?> addCourse(Authentication auth, @RequestBody CreateCourseDto dto) {

        User faculty = getLoggedInFaculty(auth);

        // Validate input
        if (dto.getCode() == null || dto.getCode().isBlank()) {
            throw new ValidationException("Course code is required");
        }
        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new ValidationException("Course title is required");
        }
        if (dto.getCode().length() > 20) {
            throw new ValidationException("Course code must not exceed 20 characters");
        }

        Course course = Course.builder()
                .code(dto.getCode().trim())
                .title(dto.getTitle().trim())
                .faculty(faculty)
                .build();

        Course saved = courseRepository.save(course);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "status", "created",
                        "courseId", saved.getId()
                )
        );
    }

    /** 3) Assign TA to faculty-owned course */
    @PostMapping("/assign")
    public ResponseEntity<?> assignTA(Authentication auth, @RequestBody AssignTADto dto) {

        User faculty = getLoggedInFaculty(auth);

        // Validate input
        if (dto.getStudentEmail() == null || dto.getStudentEmail().isBlank()) {
            throw new ValidationException("Student email is required");
        }
        if (dto.getStudentName() == null || dto.getStudentName().isBlank()) {
            throw new ValidationException("Student name is required");
        }
        
        // Validate email format
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        if (!dto.getStudentEmail().matches(emailRegex)) {
            throw new ValidationException("Invalid email format");
        }

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + dto.getCourseId()));

        if (!course.getFaculty().getId().equals(faculty.getId())) {
            throw new SecurityException("This course does not belong to you");
        }

        if (taAssignmentRepository.existsByCourse_IdAndStudentEmail(dto.getCourseId(), dto.getStudentEmail())) {
            throw new DuplicateResourceException("Student already assigned to this course");
        }

        TAAssignment assignment = TAAssignment.builder()
                .studentEmail(dto.getStudentEmail().trim())
                .studentName(dto.getStudentName().trim())
                .course(course)
                .build();

        TAAssignment saved = taAssignmentRepository.save(assignment);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "status", "assigned",
                        "assignmentId", saved.getId()
                )
        );
    }

    /** 4) List assigned TAs for a course */
    @GetMapping("/assigned/{courseId}")
    public ResponseEntity<?> getAssignedTAs(@PathVariable Long courseId, Authentication auth) {

        User faculty = getLoggedInFaculty(auth);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

        if (!course.getFaculty().getId().equals(faculty.getId())) {
            throw new SecurityException("Not allowed to view assignments for this course");
        }

        List<TAAssignment> list = taAssignmentRepository.findByCourse_Id(courseId);

        return ResponseEntity.ok(list);
    }

    /** 5) Remove TA assignment */
    @DeleteMapping("/assigned/{assignmentId}")
    public ResponseEntity<?> removeAssignment(@PathVariable Long assignmentId, Authentication auth) {

        TAAssignment a = taAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found: " + assignmentId));

        User faculty = getLoggedInFaculty(auth);

        if (!a.getCourse().getFaculty().getId().equals(faculty.getId())) {
            throw new SecurityException("Not allowed to delete this assignment");
        }

        taAssignmentRepository.deleteById(assignmentId);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "status", "deleted",
                        "assignmentId", assignmentId
                )
        );
    }

    /** 6) Reassign TA to another course of this faculty */
    @PutMapping("/reassign")
    public ResponseEntity<?> reassignTA(Authentication auth, @RequestBody AssignTADto dto) {

        User faculty = getLoggedInFaculty(auth);

        // 1) Find assignment
        TAAssignment assignment = taAssignmentRepository.findById(dto.getAssignmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found: " + dto.getAssignmentId()));

        // 2) Check ownership of original course
        if (!assignment.getCourse().getFaculty().getId().equals(faculty.getId())) {
            throw new SecurityException("You do not own this TA assignment");
        }

        // 3) Find target course
        Course targetCourse = courseRepository.findById(dto.getTargetCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Target course not found: " + dto.getTargetCourseId()));

        // 4) Target course must also belong to faculty
        if (!targetCourse.getFaculty().getId().equals(faculty.getId())) {
            throw new SecurityException("You do not own the target course");
        }

        // 5) Prevent duplicate assignment in new course
        if (taAssignmentRepository.existsByCourse_IdAndStudentEmail(dto.getTargetCourseId(), assignment.getStudentEmail())) {
            throw new DuplicateResourceException("This student is already a TA in the target course");
        }

        // 6) Update course
        assignment.setCourse(targetCourse);
        TAAssignment saved = taAssignmentRepository.save(assignment);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "status", "reassigned",
                        "assignmentId", saved.getId(),
                        "newCourseId", targetCourse.getId()
                )
        );
    }
}
