package geowave;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import geowave.models.FileMetadata;
import geowave.services.UploadService;

@RestController
@RequestMapping("/myfiles")
public class UploadController {
    private static final Logger logger = LoggerFactory.getLogger(UploadController.class);

    private final UploadService uploadService;

    @Autowired
    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping
    ResponseEntity<Map<String, Object>> uploadFile(@RequestParam("file") MultipartFile file) {
        final String filename = file.getOriginalFilename();
        final String username = getUsername();

        logger.info("User '{}' uploading file '{}'", username, filename);

        final FileMetadata metadata;
        try {
            metadata = uploadService.add(username, file);
        }
        catch (UploadService.FileExists e) {
            return createError(409, "a file with that name already exists", filename);
        }
        catch (UploadService.Error e) {
            return createError(500, "an unknown error prevents upload", filename);
        }

        final Map<String, Object> body = createSimpleWrapper("success", true);
        body.put("message", String.format("uploaded '%s'", filename));
        body.put("metadata", metadata);

        return ResponseEntity.ok(body);
    }

    @GetMapping
    ResponseEntity<Map<String, Object>> listFiles() {
        final String username = getUsername();

        logger.info("User '{}' listing files", username);

        final List<FileMetadata> files;
        try {
            files = uploadService.list(username);
        }
        catch (UploadService.Error e) {
            return createError(500, "an unknown error prevents listing of files");
        }

        final Map<String, Object> wrapper = createSimpleWrapper("files", files);

        return ResponseEntity.ok(wrapper);
    }

    @DeleteMapping("/{filename}")
    ResponseEntity<Map<String, Object>> deleteFile(@PathVariable("filename") String filename) {
        final String username = getUsername();

        logger.info("User '{}' deleting file '{}'", username, filename);

        try {
            uploadService.delete(username, filename);
        }
        catch (UploadService.NotFound e) {
            return createError(404, "not found", filename);
        }
        catch (UploadService.Error e) {
            return createError(500, "an unknown error prevents file deletion", filename);
        }

        final Map<String, Object> body = createSimpleWrapper("success", true);
        body.put("message", String.format("deleted file '%s'", filename));

        return ResponseEntity.ok(body);
    }

    //
    // Helpers
    //

    private ResponseEntity<Map<String, Object>> createError(int status, String message, String filename) {
        final ResponseEntity<Map<String, Object>> responseEntity = createError(status, message);
        final Map<String, Object> body = responseEntity.getBody();
        body.put("filename", filename);

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
