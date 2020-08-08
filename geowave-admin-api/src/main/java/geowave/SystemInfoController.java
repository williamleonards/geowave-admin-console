package geowave;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import geowave.models.Operation;
import geowave.services.DataStoreService;
import geowave.services.IndexService;
import geowave.services.OperationService;
import geowave.services.VersionService;

@RestController
public class SystemInfoController {
    private static final Logger logger = LoggerFactory.getLogger(SystemInfoController.class);

    private DataStoreService dataStoreService;
    private IndexService indexService;
    private OperationService operationService;
    private VersionService versionService;

    @Autowired
    public SystemInfoController(DataStoreService dataStoreService, IndexService indexService,
            OperationService operationService, VersionService versionService) {
        this.dataStoreService = dataStoreService;
        this.indexService = indexService;
        this.operationService = operationService;
        this.versionService = versionService;
    }

    @GetMapping("/sys/info")
    public Info getInfo() {
        logger.info("User '{}' requesting system info", getUsername());
        final Long numberOfRecordsInSystem = 33_000_000_000L;
        return new Info(operationService.all(), versionService.all(), numberOfRecordsInSystem);
    }

    @GetMapping("/sys/datastores")
    public Map<String, Object> listDataStores() {
        logger.info("User '{}' requesting datastore list", getUsername());

        final Map<String, Object> response = new HashMap<>();
        response.put("datastores", dataStoreService.list());

        return response;
    }

    @GetMapping("/sys/indices")
    public Map<String, Object> listIndices() {
        logger.info("User '{}' requesting index list", getUsername());

        final Map<String, Object> response = new HashMap<>();
        response.put("indices", indexService.list());

        return response;
    }

    @PostMapping("/sys/listIndex")
    public Map<String, Object> listIndices(@RequestBody Map<String, String> store) {
        String storeName = store.get("name");
        logger.info("User '{}' requesting index list", getUsername());

        logger.info("index list argument is " + storeName);

        final Map<String, Object> response = new HashMap<>();
        response.put("indices", indexService.listIndex(storeName));

        return response;
    }

    @PostMapping(path = "/sys/addIndex", consumes = "application/json", produces = "application/json")
    public Map<String, Object> addIndex(@RequestBody Map<String, String> store) {
        String storeName = store.get("name");
        String indexName = store.get("index");
        String type = store.get("type");
        indexService.AddIndex(storeName, indexName, type);
        return null;
    }

    @PostMapping(path = "/sys/removeIndex", consumes = "application/json", produces = "application/json")
    public Map<String, Object> removeIndex(@RequestBody Map<String, String> store) {
        String storeName = store.get("name");
        String indexName = store.get("index");
        indexService.RemoveIndex(storeName, indexName);
        return null;
    }

    @PostMapping(path = "/sys/addRedisStore", consumes = "application/json", produces = "application/json")
    public Map<String, Object> addRedisStore(@RequestBody Map<String, String> store) {
        String storeName = store.get("name");
        dataStoreService.AddRedisStore(storeName);
        return null;
    }

    @PostMapping(path = "/sys/removeStore", consumes = "application/json", produces = "application/json")
    public Map<String, Object> removeStore(@RequestBody Map<String, String> store) {
        String storeName = store.get("name");
        dataStoreService.RemoveStore(storeName);
        return null;
    }

    @PostMapping(path = "/sys/clearStore", consumes = "application/json", produces = "application/json")
    public Map<String, Object> clearStore(@RequestBody Map<String, String> store) {
        String storeName = store.get("name");
        dataStoreService.ClearStore(storeName);
        return null;
    }

    //
    // Helpers
    //

    private String getUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private static class Info {
        private Metrics metrics;
        private List<Operation> operations;
        private Map<String, String> versions;

        Info(List<Operation> operations, Map<String, String> versions, Long records) {
            this.versions = versions;
            this.metrics = new Metrics(records);
            this.operations = operations;
        }

        public Metrics getMetrics() {
            return metrics;
        }

        public List<Operation> getOperations() {
            return operations;
        }

        public Map<String, String> getVersions() {
            return versions;
        }
    }

    public static class Metrics {
        private Long records;

        Metrics(Long records) {
            this.records = records;
        }

        public Long getRecords() {
            return records;
        }
    }

}
