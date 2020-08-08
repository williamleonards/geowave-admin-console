package geowave;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class HealthController {

    private static long start = System.currentTimeMillis();

    @GetMapping("/health")
    Map<String, Object> health() {
        final Map<String, Object> response = new HashMap<>();

        response.put("component", "geowave-admin-api");
        response.put("uptime", (System.currentTimeMillis() - start) / 1000);

        return response;
    }
}
