package ESD.project.TA.Registration.service;

import ESD.project.TA.Registration.entity.User;
import ESD.project.TA.Registration.exception.ResourceNotFoundException;
import ESD.project.TA.Registration.repo.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /**
     * Find user by username (OAuth username = email).
     */
    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    /**
     * Optional lookup by username.
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Create or update OAuth user (Faculty only).
     */
    @Transactional
    public User createOrUpdateFromOAuth(String email, String name, String providerId) {

        // Try email -> THEN username
        Optional<User> existing =
                userRepository.findByEmail(email).isPresent()
                        ? userRepository.findByEmail(email)
                        : userRepository.findByUsername(email);

        if (existing.isPresent()) {
            return existing.get();
        }

        // Create faculty record
        User u = new User();
        u.setUsername(email);   // Spring Security principal name
        u.setEmail(email);
        u.setFullName(name);
        u.setProvider("google");
        u.setProviderId(providerId);

        return userRepository.save(u);
    }
}
