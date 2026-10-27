package com.project.Habitude;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@Slf4j
@EnableCaching
@SpringBootApplication
public class HabitudeApplication {

	public static void main(String[] args) {
		SpringApplication.run(HabitudeApplication.class, args);
		log.info("Application Started Successfully");
		System.out.println("Hello Developer");
	}

}
