package ESD.project.TA.Registration.config;

import ESD.project.TA.Registration.exception.UnauthorizedException;
import ESD.project.TA.Registration.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        String email = null;
        String name = null;
        String providerId = null;

        if (authentication.getPrincipal() instanceof OidcUser oidc) {
            email = oidc.getEmail();
            name = oidc.getFullName();
            providerId = oidc.getSubject();
        } else if (authentication.getPrincipal() instanceof OAuth2User oauthUser) {
            email = (String) oauthUser.getAttributes().get("email");
            name = (String) oauthUser.getAttributes().get("name");
            providerId = (String) oauthUser.getAttributes().get("sub");
        }

        if (email == null) {
            throw new UnauthorizedException("OAuth login failed: no email received");
        }

        // Save/Update faculty user
        userService.createOrUpdateFromOAuth(email, name, providerId);

        // Always redirect faculty to dashboard
        response.sendRedirect("http://localhost:3000/faculty");
    }
}
