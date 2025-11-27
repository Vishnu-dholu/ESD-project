package ESD.project.TA.Registration.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ta_assignments",
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_email", "course_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TAAssignment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentEmail;
    private String studentName;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id")
    private Course course;
}
