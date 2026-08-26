package com.teamup;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TeamUpApplication {

    public static void main(String[] args) {
        SpringApplication.run(TeamUpApplication.class, args);
        System.out.println("🚀 Team Up Spring Boot Server is running at http://localhost:5000");
    }
}
