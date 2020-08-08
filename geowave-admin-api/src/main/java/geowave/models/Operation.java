package geowave.models;

import java.time.Instant;

public class Operation {
    private String identifier;
    private String status;
    private Instant timeStarted;
    private Instant timeStopped;

    public Operation(String identifier, String status, Instant timeStarted, Instant timeStopped) {
        this.identifier = identifier;
        this.status = status;
        this.timeStarted = timeStarted;
        this.timeStopped = timeStopped;
    }

    public String getIdentifier() {
        return identifier;
    }

    public Instant getTimeStarted() {
        return timeStarted;
    }

    public String getStatus() {
        return status;
    }

    public Instant getTimeStopped() {
        return timeStopped;
    }
}
