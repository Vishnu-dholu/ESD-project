package ESD.project.TA.Registration.repo;

import ESD.project.TA.Registration.entity.TAAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TAAssignmentRepository extends JpaRepository<TAAssignment, Long> {

    // List all TAs for a course
    List<TAAssignment> findByCourse_Id(Long courseId);

    // Check if a TA assignment already exists for same course & student
    boolean existsByCourse_IdAndStudentEmail(Long courseId, String studentEmail);

    Optional<TAAssignment> findById(Long id);
}
