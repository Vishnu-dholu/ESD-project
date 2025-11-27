package ESD.project.TA.Registration.controller;

import ESD.project.TA.Registration.entity.User;
import ESD.project.TA.Registration.exception.ValidationException;
import ESD.project.TA.Registration.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

        String email = body.get("email");

        if (email == null || email.isBlank())
            throw new ValidationException("Email required");

        // Validate email format
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        if (!email.matches(emailRegex)) {
            throw new ValidationException("Invalid email format");
        }

        User faculty = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(
                        User.builder().email(email).fullName("Faculty").build()
                ));

        return ResponseEntity.ok(Map.of(
                "id", faculty.getId(),
                "email", faculty.getEmail()
        ));
    }
}
