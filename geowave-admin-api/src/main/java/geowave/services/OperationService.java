package geowave.services;

import geowave.models.Operation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OperationService {
    private static final Logger logger = LoggerFactory.getLogger(OperationService.class);

    private final List<Operation> items = new ArrayList<>();

    public List<Operation> all() {
        logger.debug("Listing all tracked operations");
        return items;
    }

    // DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG
    // DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG
    // Placeholder implementation
    @PostConstruct
    private void SEED_TEST_DATA() {
        logger.warn("**** SEEDING TEST DATA ****");

        items.add(new Operation("ingest:s3:3b0af3d7", "success", ZonedDateTime.now().minusHours(36).toInstant(), ZonedDateTime.now().minusHours(30).toInstant()));
        items.add(new Operation("ingest:s3:f6629607", "running", ZonedDateTime.now().minusHours(2).toInstant(), null));
        items.add(new Operation("analytic:spatialjoin:5c86b90c", "error", ZonedDateTime.now().minusHours(1).toInstant(), ZonedDateTime.now().minusMinutes(15).toInstant()));
        items.add(new Operation("ingest:hdfs:9191faa2", "pending", ZonedDateTime.now().minusHours(0).toInstant(), null));
    }
    // DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG
    // DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG
}
