package ESD.project.TA.Registration.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses",
       uniqueConstraints = @UniqueConstraint(columnNames = {"code", "faculty_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String title;

    @ManyToOne(optional = false)
    @JoinColumn(name = "faculty_id")
    private User faculty;
}