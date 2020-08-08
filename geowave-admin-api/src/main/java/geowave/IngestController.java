package geowave;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import geowave.services.IngestService;

@RestController
public class IngestController {
    private static final Logger logger = LoggerFactory.getLogger(IngestController.class);

    private final IngestService ingestService;

    @Autowired
    public IngestController(IngestService ingestService) {
        this.ingestService = ingestService;
    }

    @PostMapping("/ingest")
    public ResponseEntity<Map<String, Object>> start(@RequestBody StartParams params) {
        logger.info("{}", params);

        final String operationId;
        final List<URI> sourceUris = params.sourceUris;
        try {
            operationId = ingestService.start(getUsername(), sourceUris, params.datastore, params.indices);
        }
        catch (IngestService.NoSources e) {
            return createError(400, "no valid sources identified in this submission", "sourceUris", sourceUris);
        }
        catch (IngestService.SourceNotFound e) {
            return createError(400, "one or more sources cannot be found", "sourceUri", e.getUri());
        }
        catch (IngestService.Error e) {
            return createError(500, "an unknown error prevents ingest");
        }

        return ResponseEntity.ok(createSimpleWrapper("operationId", operationId));
    }

    //
    // Helpers
    //

    private static class StartParams {
        public String datastore;
        public List<String> indices;
        public List<URI> sourceUris;

        @Override
        public String toString() {
            return "StartParams{" +
                    "datastore='" + datastore + '\'' +
                    ", indices=" + indices +
                    ", sourceUris='" + sourceUris + '\'' +
                    '}';
        }
    }

    private ResponseEntity<Map<String, Object>> createError(int status, String message, Object... tuples) {
        final ResponseEntity<Map<String, Object>> responseEntity = createError(status, message);
        final Map<String, Object> body = responseEntity.getBody();

        for (int i = 0; i < tuples.length - (tuples.length % 2); i++) {
            Object key = tuples[i];
            Object value = tuples[++i];
            body.put(String.valueOf(key), value);
        }

        return responseEntity;
    }

    private ResponseEntity<Map<String, Object>> createError(int status, String message) {
        return ResponseEntity.status(status).body(createSimpleWrapper("error", message));
    }

    private Map<String, Object> createSimpleWrapper(String key, Object value) {
        final HashMap<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }

    private String getUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
