package com.eventease;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class EventEaseBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventEaseBackendApplication.class, args);
    }
}
