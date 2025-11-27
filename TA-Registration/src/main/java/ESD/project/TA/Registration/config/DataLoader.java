package ESD.project.TA.Registration.config;

import ESD.project.TA.Registration.entity.Course;
import ESD.project.TA.Registration.entity.User;
import ESD.project.TA.Registration.repo.CourseRepository;
import ESD.project.TA.Registration.repo.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @PostConstruct
    public void load() {
        if (userRepository.count() == 0) {

            User prof = userRepository.save(
                    User.builder()
                            .username("prof.jane@example.com")
                            .email("prof.jane@example.com")
                            .fullName("Prof Jane")
                            .provider("seed")
                            .providerId("seed-1")
                            .build()
            );

            courseRepository.save(
                    Course.builder().code("CS101").title("Data Structures").faculty(prof).build()
            );

            courseRepository.save(
                    Course.builder().code("CS201").title("Algorithms").faculty(prof).build()
            );
        }
    }
}
