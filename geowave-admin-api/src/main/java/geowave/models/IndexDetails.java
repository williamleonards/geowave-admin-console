package geowave.models;

import java.util.Map;

public class IndexDetails {
    private final String name;
    private final String type;
    private final Map<String, String> options;

    public IndexDetails(String name, String type, Map<String, String> options) {
        this.name = name;
        this.options = options;
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public Map<String, String> getOptions() {
        return options;
    }

    public String getType() {
        return type;
    }
}
