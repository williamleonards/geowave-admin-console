package geowave;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    private final static Logger logger = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(HttpServletRequest request, @RequestParam String username, @RequestParam String password) {
        logger.debug("User '{}' attempting to log in", username);

        try {
            request.login(username, password);
        }
        catch (ServletException ex) {
            if (ex.getMessage().equals("Bad credentials")) {
                logger.warn("Failed login attempt for '{}'", username);
                return createErrorResponse(401, "invalid username and/or password");
            }

            if (ex.getMessage().contains("already authenticated as")) {
                logger.warn("User '{}' attempted login on active session", username);
                return createErrorResponse(403, "already logged in");
            }

            logger.warn("Failed login attempt for '{}'", username);
            return createErrorResponse(401, "invalid username and/or password");
        }

        logger.info("User '{}' logged in", username);

        return ResponseEntity.ok(createWrapper("username", username));
    }

    /**
     * Ref: https://github.com/spring-projects/spring-security/blob/5.0.x/web/src/main/java/org/springframework/security/web/authentication/logout/SecurityContextLogoutHandler.java
     */
    @PostMapping("/logout")
    public Map<String, Object> logout(HttpServletRequest request, HttpServletResponse response, CookieCsrfTokenRepository ctr) {
        final SecurityContext context = SecurityContextHolder.getContext();
        final String username = context.getAuthentication().getName();

        logger.debug("Destroy CSRF token (username={})", username);
        ctr.saveToken(null, request, response);

        logger.debug("Destroy authentication (username={})", username);
        context.setAuthentication(null);

        logger.debug("Invalidate session (username={})", username);
        request.getSession(false).invalidate();

        logger.debug("Clear security context (username={})", username);
        SecurityContextHolder.clearContext();

        logger.info("User '{}' logged out", username);

        return createWrapper("message", "logged out");
    }

    @GetMapping("/whoami")
    public ResponseEntity<Map<String, Object>> whoami(HttpServletRequest request) {
        final Principal principal = request.getUserPrincipal();

        if (principal == null) {
            return createErrorResponse(401, "not logged in");
        }

        return ResponseEntity.ok(createWrapper("username", principal.getName()));
    }

    private ResponseEntity<Map<String, Object>> createErrorResponse(int status, String message) {
        return ResponseEntity.status(status).body(createWrapper("error", message));
    }

    private Map<String, Object> createWrapper(String key, Object value) {
        Map<String, Object> body = new HashMap<>();
        body.put(key, value);
        return body;
    }
}
