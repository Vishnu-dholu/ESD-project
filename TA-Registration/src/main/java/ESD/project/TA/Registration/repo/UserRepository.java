package ESD.project.TA.Registration.repo;

import ESD.project.TA.Registration.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Used by OAuth2SuccessHandler and UserService
    Optional<User> findByEmail(String email);

    // Spring Security uses username = email
    Optional<User> findByUsername(String username);
}
