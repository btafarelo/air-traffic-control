package com.github.btafarelo.airtraffic.radardetection.adapters.in.kafka;

import com.github.btafarelo.airtraffic.flightsimulation.domain.events.FlightDetectedEvent;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

import static org.apache.kafka.clients.consumer.ConsumerConfig.*;

@Configuration
@EnableKafka
@Profile("kafka")
public class KafkaConfig {

    @Value(value = "${spring.kafka.bootstrap-servers}")
    private String bootstrapAddress;

    @Bean
    public ConsumerFactory<String, FlightDetectedEvent> consumerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(BOOTSTRAP_SERVERS_CONFIG, bootstrapAddress);
        configProps.put(KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configProps.put(VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        JsonDeserializer<FlightDetectedEvent> payloadJsonDeserealizer = new JsonDeserializer<>();
        payloadJsonDeserealizer.addTrustedPackages("com.github.btafarelo.airtraffic.flightsimulation.domain.events");
        return new DefaultKafkaConsumerFactory<>(configProps, null,payloadJsonDeserealizer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, FlightDetectedEvent> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, FlightDetectedEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        return factory;
    }
}