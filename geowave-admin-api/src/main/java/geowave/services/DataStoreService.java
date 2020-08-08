package geowave.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import geowave.models.DataStoreDetails;

@Service
public class DataStoreService {
    private static final Logger logger = LoggerFactory.getLogger(DataStoreService.class);

    private static final String ENDPOINT_CONFIG_LIST = "/v0/config/list?filter=^store\\.";
    private static final Pattern PATTERN_PROPERTY_KEY = Pattern.compile("^store\\.(?<name>[^.]+)\\.(?<property>.*)$");
    private static final Pattern PATTERN_SENSITIVE = Pattern.compile("(secret|pass|password)",
            Pattern.CASE_INSENSITIVE);

    private static final String ADD_STORE_URL = "/v0/store/add/redis?name=";
    private static final String RM_STORE_URL = "/v0/store/rm?name=";
    private static final String STORE_URL = "/v0/store/";

    private final RestTemplate client;

    @Autowired
    public DataStoreService(@Qualifier("restservices") RestTemplate client) {
        this.client = client;
    }

    public List<DataStoreDetails> list() {
        final List<DataStoreDetails> datastores = new ArrayList<>();

        logger.debug("Requesting config properties (endpoint={})", ENDPOINT_CONFIG_LIST);

        final ConfigListResponse configList = client.getForObject(ENDPOINT_CONFIG_LIST, ConfigListResponse.class);

        // Group properties by store name
        final Map<String, Map<String, String>> groups = new HashMap<>();
        for (Map.Entry<String, String> entry : configList.data.entrySet()) {
            final String key = entry.getKey();
            logger.debug("Inspect '{}'", key);

            final Matcher matcher = PATTERN_PROPERTY_KEY.matcher(key);
            if (!matcher.matches()) {
                logger.warn("Discarding invalid store property '{}'", key);
                continue;
            }

            final String name = matcher.group("name");
            final String prop = matcher.group("property").replaceAll("^opts\\.", "");

            if (PATTERN_SENSITIVE.matcher(prop).matches()) {
                logger.debug("Discarding sensitive store property '{}'", prop);
                continue;
            }

            final Map<String, String> group = groups.computeIfAbsent(name, (k) -> new HashMap<>());

            group.put(prop, entry.getValue());
        }

        // Convert groups to models
        for (Map.Entry<String, Map<String, String>> group : groups.entrySet()) {
            final String name = group.getKey();
            final Map<String, String> props = group.getValue();

            final String type = props.remove("type");

            datastores.add(new DataStoreDetails(name, type, props));
        }

        return datastores;
    }

    public void AddRedisStore(String store) {
        final String url = STORE_URL + "add/redis?name=" + store + "&address=redis%3A%2F%2F127.0.0.1%3A6379";
        client.postForObject(url, null, String.class);
    }

    public void RemoveStore(String store) {
        final String url = STORE_URL + "rm?name=" + store;
        client.postForObject(url, null, String.class);
    }

    public void ClearStore(String store) {
        final String url = STORE_URL + "clear?storeName=" + store;
        client.postForObject(url, null, String.class);
    }

    public void ListTypes(String store) {
        final String url = STORE_URL + "listtypes?storeName=" + store;
        client.getForObject(url, null, String.class);
    }

    public void RemoveType(String store, String type) {
        final String url = STORE_URL + "rmtype?storeName=" + store + "&datatypeName=" + type;
        client.postForObject(url, null, String.class);
    }

    public void GeoWaveVersion(String store) {
        final String url = STORE_URL + "version?storeName=" + store;
        client.getForObject(url, null, String.class);
    }

    private static class ConfigListResponse {
        public Map<String, String> data;
    }
}
