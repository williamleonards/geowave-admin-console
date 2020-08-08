package geowave.services;

import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Paths;
import java.util.*;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class IngestService {
    private static final Logger logger = LoggerFactory.getLogger(IngestService.class);

    private static final String ENDPOINT_LOCAL_TO_GEOWAVE = "/v0/ingest/localToGW";
    private static final String KEY_DATASTORE = "storename";
    private static final String KEY_INDICES = "index_group_list";
    private static final String KEY_LOCAL_PATH = "file_or_directory";
    private static final String SCHEME_UPLOADS = "myfiles";

    private final UploadService uploadService;
    private final RestTemplate client;

    @Autowired
    public IngestService(UploadService uploadService, @Qualifier("restservices") RestTemplate client) {
        this.client = client;
        this.uploadService = uploadService;
    }

    public String start(String username, List<URI> uris, String datastore, List<String> indices) throws Error {
        logger.debug("Starting ingest (username={}, uris={}, datastore={}, indices={})", username, uris, datastore, indices);

        final List<URI> supportedUris = new ArrayList<>();

        final UUID batch = UUID.randomUUID();

        for (URI uri : uris) {
            switch (StringUtils.defaultString(uri.getScheme())) {
                case SCHEME_UPLOADS:
                    supportedUris.add(processUpload(username, uri, batch));
                    break;

                default:
                    logger.warn("Discarding unsupported URI '{}'", uri);
                    break;
            }
        }

        if (supportedUris.isEmpty()) {
            throw new NoSources();
        }

        /*
          FIXME -- This is a naive implementation with the following assumptions:

              (a) that GeoWave REST will honor `batchUUID` convention of storing
                  only files belonging to the batch in the same directory.

              (b) that all contents of supportedUri are homogeneous (i.e.,
                  myfiles://, hdfs://, etc)
         */

        final Map<String, Object> body = new HashMap<>();
        body.put(KEY_DATASTORE, datastore);
        body.put(KEY_INDICES, indices);
        body.put(KEY_LOCAL_PATH, Paths.get(supportedUris.get(0)).getParent().toString());

        final ResponseEntity<LocalToGeoWaveResponse> response;
        try {
            response = client.postForEntity(ENDPOINT_LOCAL_TO_GEOWAVE, body, LocalToGeoWaveResponse.class);
        }
        catch (RestClientException e) {
            logger.error("Could not start ingest: cannot communicate with GeoWave (endpoint={})", ENDPOINT_LOCAL_TO_GEOWAVE);
            throw new Error("cannot communicate with GeoWave: %s", e.getMessage());
        }

        final HttpStatus status = response.getStatusCode();
        if (!status.is2xxSuccessful()) {
            logger.error("Could not start ingest: GeoWave returned HTTP {} (endpoint={})", status, ENDPOINT_LOCAL_TO_GEOWAVE);
            throw new Error("ingest failed to start");
        }

        return response.getBody().data;
    }

    //
    // Helpers
    //

    static class LocalToGeoWaveResponse {
        public String data;
    }

    private URI processUpload(String username, URI uri, UUID batch) throws Error {
        final String remotePath;
        try {
            final String filename = uri.getSchemeSpecificPart().replaceAll("^//", "");
            remotePath = uploadService.transfer(username, filename, batch);
        }
        catch (UploadService.NotFound e) {
            logger.error("Cannot start ingest: {} (uri={})", e.getMessage(), uri);
            throw new SourceNotFound(uri);
        }
        catch (UploadService.Error e) {
            logger.error("Cannot start ingest: {} (uri={})", e.getMessage(), uri);
            throw new Error("file transfer failed: %s", e.getMessage());
        }

        final URI validatedUri;
        try {
            // HACK -- this is currently how files present to GeoWave REST's `localToGw` endpoint
            validatedUri = new URI("file", "", remotePath, null);
        }
        catch (URISyntaxException e) {
            logger.error("Cannot start ingest: {} (uri={}, remotePath={})", e, uri, remotePath);
            throw new Error("file transfer failed: invalid remote path");
        }
        return validatedUri;
    }

    public static class Error extends Exception {
        Error(String message) {
            super(message);
        }

        Error(String message, Object... args) {
            this(String.format(message, args));
        }
    }

    public static class NoSources extends Error {
        NoSources() {
            super("no sources to ingest");
        }
    }

    public static class SourceNotFound extends Error {
        private final URI uri;

        SourceNotFound(URI uri) {
            super("source '%s' not found", uri);
            this.uri = uri;
        }

        public URI getUri() {
            return uri;
        }
    }
}
