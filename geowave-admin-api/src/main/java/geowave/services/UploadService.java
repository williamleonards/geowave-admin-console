package geowave.services;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.UUID;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import geowave.models.FileMetadata;

@Service
public class UploadService {
    private static final Logger logger = LoggerFactory.getLogger(UploadService.class);

    private static final String ENDPOINT_UPLOAD = "/v0/fileupload?batchUUID={batch}";
    private static final String KEY_EXPIRES_AT = "expires";
    private static final String KEY_FILENAME = "filename";
    private static final String KEY_FILESIZE = "filesize";
    private static final String KEY_OWNER = "owner";
    private static final String KEY_UPLOADED_AT = "uploadedAt";
    private static final String METADATA_SUFFIX = ".meta.properties";

    private final String basePath;
    private final Duration fileMaxAge;
    private final RestTemplate client;

    @Autowired
    public UploadService(
            @Value("${geowave.upload.basePath}") String basePath,
            @Value("${geowave.upload.fileMaxAge}") Long fileMaxAge,
            @Qualifier("restservices") RestTemplate client) {
        this.basePath = new File(basePath).getAbsolutePath();
        this.fileMaxAge = Duration.ofSeconds(fileMaxAge);
        this.client = client;
    }

    public FileMetadata add(String username, MultipartFile rawFile) throws Error {
        final String filename = normalizeFilename(rawFile.getOriginalFilename());
        final File file = fileFor(username, filename);

        if (file.exists()) {
            throw new FileExists(file.getAbsolutePath());
        }

        logger.debug("Adding file (username={}, path={})", username, file);
        try {
            rawFile.transferTo(file);
        }
        catch (IOException e) {
            logger.error("Could not add file (path={})", file, e);
            throw new Error("could not store file '%s': %s", file, e);
        }

        return writeMetadata(username, filename, rawFile.getSize());
    }

    public void delete(String username, String filename) throws Error {
        final File file = fileFor(username, filename);
        final File metadataFile = fileFor(username, filename + METADATA_SUFFIX);

        logger.debug("Deleting file (username={}, filename={}, metadata={})", username, filename, metadataFile);

        if (!file.exists()) {
            logger.error("Cannot delete nonexistent file (path={})", file);
            throw new NotFound(file.getAbsolutePath());
        }

        if (!metadataFile.exists()) {
            logger.error("Cannot delete nonexistent metadataFile (path={})", metadataFile);
            throw new NotFound(metadataFile.getAbsolutePath());
        }

        if (!file.delete()) {
            logger.error("Could not delete file (path={})", file);
            throw new Error("delete failed");
        }

        if (!metadataFile.delete()) {
            logger.error("Could not delete metadata file (path={})", metadataFile);
            throw new Error("delete failed");
        }
    }

    public List<FileMetadata> list(String username) throws Error {
        List<FileMetadata> items = new ArrayList<>();

        logger.debug("Listing files (username={})", username);

        final File[] metadataFiles = directoryForUser(username).listFiles(f -> f.getName().endsWith(METADATA_SUFFIX));

        if (metadataFiles == null) {
            return items;
        }

        for (File metadataFile : metadataFiles) {
            logger.debug("Read metadata file (path={})", metadataFile);
            final Properties properties;
            try {
                properties = new Properties();
                properties.load(new FileReader(metadataFile));
            }
            catch (IOException e) {
                logger.error("Could not read metadata file (path={})", metadataFile, e);
                continue;
            }

            final FileMetadata metadata;
            try {
                metadata = readMetadata(properties);
            }
            catch (InvalidMetadataProperty e) {
                logger.error("Malformed metadata file: {} (path={})", e.getMessage(), metadataFile);
                continue;
            }

            items.add(metadata);
        }

        return items;
    }

    public String transfer(String username, String filename, UUID batch) throws Error {
        final File file = fileFor(username, filename);
        if (!file.exists()) {
            logger.error("Cannot transfer nonexistent file (path={})", file);
            throw new NotFound(filename);
        }

        if (batch == null) {
            batch = UUID.randomUUID();
        }

        logger.debug("Transferring file (path={}, batch={})", file, batch);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, FileSystemResource> body = new LinkedMultiValueMap<>();
        body.add("file", new FileSystemResource(file));

        HttpEntity<MultiValueMap<String, FileSystemResource>> requestEntity = new HttpEntity<>(body, headers);

        final ResponseEntity<FileUploadResponse> responseEntity;
        try {
            responseEntity = client.postForEntity(ENDPOINT_UPLOAD, requestEntity, FileUploadResponse.class, batch);
        }
        catch (RestClientException e) {
            logger.error("Could not transfer file: cannot communicate with GeoWave (path={}, endpoint={})", file, ENDPOINT_UPLOAD);
            throw new Error("cannot communicate with GeoWave: %s", e.getMessage());
        }

        final HttpStatus status = responseEntity.getStatusCode();
        if (!status.is2xxSuccessful()) {
            logger.error("Could not transfer file: GeoWave returned HTTP {} (path={}, endpoint={})", status, file, ENDPOINT_UPLOAD);
            throw new Error("transfer failed for '%s'", filename);
        }

        final String remotePath = responseEntity.getBody().name;

        logger.debug("Transferred file successfully (local={}, remote={})", file, remotePath);

        delete(username, filename);

        return remotePath;
    }

    //
    // Helpers
    //

    static class FileUploadResponse {
        public String name;
    }

    private void clean() {
        // TODO -- delete files older than TTL
        // TODO -- delete data files that are missing METADATA files
        // TODO -- delete METADATA files that are missing data files
    }

    private File directoryForUser(String username) throws Error {
        final File directory = new File(basePath + File.separator + username);
        if (!directory.exists()) {
            final String absolutePath = directory.getAbsolutePath();

            logger.debug("Creating user directory (username={}, dest={})", username, absolutePath);
            if (!directory.mkdirs()) {
                logger.error("Could not create user directory (username={}, dest={})", username, absolutePath);
                throw new DirectoryCreationFailed(absolutePath);
            }
        }

        return directory;
    }

    private File fileFor(String username, String filename) throws Error {
        return new File(directoryForUser(username).getAbsolutePath() + File.separator + filename);
    }

    private String normalizeFilename(String rawFilename) {
        return rawFilename
                .replaceAll("[^\\w_\\-. ]+", "-")
                .replaceAll(Pattern.quote(METADATA_SUFFIX), "")
                ;
    }

    private FileMetadata readMetadata(Properties properties) throws InvalidMetadataProperty {
        final String name = properties.getProperty(KEY_FILENAME);
        if (StringUtils.isEmpty(name)) {
            throw new InvalidMetadataProperty(KEY_FILENAME);
        }

        final Instant uploadedAt;
        try {
            uploadedAt = Instant.parse(properties.getProperty(KEY_UPLOADED_AT));
        }
        catch (DateTimeParseException e) {
            throw new InvalidMetadataProperty(KEY_UPLOADED_AT);
        }

        final Instant expiresAt;
        try {
            expiresAt = Instant.parse(properties.getProperty(KEY_EXPIRES_AT));
        }
        catch (DateTimeParseException e) {
            throw new InvalidMetadataProperty(KEY_EXPIRES_AT);
        }

        final Long size;
        try {
            size = Long.valueOf(properties.getProperty(KEY_FILESIZE));
        }
        catch (NumberFormatException e) {
            throw new InvalidMetadataProperty(KEY_FILESIZE);
        }

        return new FileMetadata(name, size, expiresAt, uploadedAt);
    }

    private FileMetadata writeMetadata(String username, String filename, Long filesize) throws Error {
        final Instant uploadedAt = Instant.now();
        final Instant expiresAt = uploadedAt.plus(fileMaxAge);

        Properties properties = new Properties();
        properties.put(KEY_OWNER, username);
        properties.put(KEY_FILENAME, filename);
        properties.put(KEY_FILESIZE, filesize.toString());
        properties.put(KEY_UPLOADED_AT, uploadedAt.toString());
        properties.put(KEY_EXPIRES_AT, expiresAt.toString());

        final File file = fileFor(username, filename + METADATA_SUFFIX);

        logger.debug("Writing metadata file (path={})", file);
        try {
            properties.store(new FileWriter(file), null);
        }
        catch (IOException e) {
            logger.error("Could not write metadata file (path={})", file);
            throw new Error("could not write metadata file for '%s'", file.getAbsolutePath());
        }

        return readMetadata(properties);
    }

    //
    // Errors
    //

    public static class Error extends IOException {
        Error(String message, Object... args) {
            this(String.format(message, args));
        }

        Error(String message) {
            super(message);
        }
    }

    public static class DirectoryCreationFailed extends Error {
        DirectoryCreationFailed(String directoryName) {
            super(String.format("could not create directory '%s'", directoryName));
        }
    }

    public static class FileExists extends Error {
        FileExists(String filename) {
            super(String.format("'%s' already exists", filename));
        }
    }

    public static class InvalidMetadataProperty extends Error {
        InvalidMetadataProperty(String key) {
            super(String.format("'%s' is missing or invalid", key));
        }
    }

    public static class NotFound extends Error {
        NotFound(String filename) {
            super(String.format("file '%s' does not exist", filename));
        }
    }
}
