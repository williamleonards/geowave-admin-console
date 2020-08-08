package geowave.services;

import java.io.FileReader;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class VersionService {
    private static final Logger logger = LoggerFactory.getLogger(VersionService.class);

    private final String componentsFile;

    public VersionService(@Value("${geowave.componentsFile}") String componentsFile) {
        this.componentsFile = componentsFile;
    }

    public Map<String, String> all() {
        final Map<String, String> items = new LinkedHashMap<>();

        final Properties properties = new Properties();

        try {
            logger.debug("Read componentsfile '{}'", componentsFile);
            properties.load(new FileReader(componentsFile));
        }
        catch (IOException ex) {
            logger.error("Could not read componentsfile '{}': {}", componentsFile, ex.getMessage());
        }

        logger.debug("Found {} component entries", properties.size());
        for (Map.Entry entry : properties.entrySet()) {
            final String key = entry.getKey().toString();
            final String value = entry.getValue().toString();

            items.put(key, value);
        }

        return items;
    }
}
