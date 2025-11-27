package ESD.project.TA.Registration.service;

import ESD.project.TA.Registration.entity.Course;
import ESD.project.TA.Registration.exception.ResourceNotFoundException;
import ESD.project.TA.Registration.repo.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    /**
     * Return courses taught by given faculty id.
     */
    public List<Course> getCoursesByFaculty(Long facultyId) {
        return courseRepository.findByFaculty_Id(facultyId);
    }

    /**
     * Get course by ID or throw.
     */
    public Course getCourseById(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found: " + courseId));
    }
}
