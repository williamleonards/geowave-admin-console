package geowave.models;

import java.time.Instant;

public class FileMetadata {
    private String name;
    private Long size;
    private Instant expiresAt;
    private Instant uploadedAt;

    public FileMetadata(String name, Long size, Instant expiresAt, Instant uploadedAt) {
        this.name = name;
        this.size = size;
        this.expiresAt = expiresAt;
        this.uploadedAt = uploadedAt;
    }

    public String getName() {
        return name;
    }

    public Long getSize() {
        return size;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }
}
