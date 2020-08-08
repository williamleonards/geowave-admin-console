package geowave.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;


@Component
public class ClientsConfig {
    private static final Logger logger = LoggerFactory.getLogger(ClientsConfig.class);

    private final String restservicesUri;

    public ClientsConfig(@Value("${geowave.restservicesUri}") String restservicesUri) {
        this.restservicesUri = restservicesUri;
    }

    @Bean
    public RestTemplate restservices() {
        logger.debug("Creating restservices client (root={})", restservicesUri);

        return new RestTemplateBuilder()
            .rootUri(restservicesUri)
            .build();
    }
}
