package geowave.services;

import java.util.*;
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

import geowave.models.IndexDetails;

@Service
public class IndexService {
    private static final Logger logger = LoggerFactory.getLogger(IndexService.class);

    private static final String ENDPOINT_CONFIG_LIST = "/v0/config/list?filter=^index\\.";
    private static final Pattern PATTERN_PROPERTY_KEY = Pattern.compile("^index\\.(?<name>[^.]+)\\.(?<property>.*)$");

    private static final String ADD_INDEX_URL = "/v0/index/add?storeName=";
    private static final String RM_INDEX_URL = "/v0/index/rm?storeName=";
    private static final String LIST_INDEX_URL = "/v0/index/list?storeName=";

    private final RestTemplate client;

    @Autowired
    public IndexService(@Qualifier("restservices") RestTemplate client) {
        this.client = client;
    }

    public List<IndexDetails> list() {
        final List<IndexDetails> indices = new ArrayList<>();

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

            final Map<String, String> group = groups.computeIfAbsent(name, (k) -> new HashMap<>());

            group.put(prop, entry.getValue());
        }

        // Convert groups to models
        for (Map.Entry<String, Map<String, String>> group : groups.entrySet()) {
            final String name = group.getKey();
            final Map<String, String> props = group.getValue();

            final String type = props.remove("type");

            indices.add(new IndexDetails(name, type, props));
        }

        return indices;
    }

    public List<IndexDetails> listIndex(String storeName) {
        final String completeURL = LIST_INDEX_URL + storeName;
        String indexList = client.getForObject(completeURL, String.class);

        logger.info("response is " + indexList);
        // Extract the string containing the indexes
        String data = indexList.substring(indexList.indexOf("Available indexes: ") + "Available indexes: ".length());

        // Trim the last whitespace and quotes, then convert to array by splitting on
        // whitespace
        String indexes = data.substring(0, data.length() - 2);
        String[] indexArray = indexes.split(" ");
        logger.info("indices of " + storeName + " are " + Arrays.toString(indexArray));
        ArrayList<IndexDetails> response = new ArrayList<>();

        for (int i = 0; i < indexArray.length; i++) {
            response.add(new IndexDetails(indexArray[i], "", null));
        }

        return response;
    }

    public void AddIndex(String storeName, String indexName, String type) {
        final String completeURL = ADD_INDEX_URL + storeName + "&indexName=" + indexName + "&type=" + type;
        client.postForObject(completeURL, null, String.class);
    }

    public void RemoveIndex(String storeName, String indexName) {
        final String completeURL = RM_INDEX_URL + storeName + "&indexName=" + indexName;
        client.postForObject(completeURL, null, String.class);
    }

    private static class ConfigListResponse {
        public Map<String, String> data;
    }
}
