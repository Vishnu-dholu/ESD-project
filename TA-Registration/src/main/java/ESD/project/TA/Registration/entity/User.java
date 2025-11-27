package ESD.project.TA.Registration.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "faculty")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Spring Security uses username internally, so we set username = email
    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    private String fullName;

    // For OAuth users (optional but useful)
    private String provider;      // "google"
    private String providerId;    // Google sub ID
}
