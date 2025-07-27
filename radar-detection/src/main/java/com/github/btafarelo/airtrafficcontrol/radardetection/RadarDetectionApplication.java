package com.github.btafarelo.airtrafficcontrol.radardetection;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RadarDetectionApplication {

    @Autowired
    private AmqpTemplate amqpTemplate;

    public static void main(String[] args) {
        SpringApplication.run(RadarDetectionApplication.class, args);
    }


}