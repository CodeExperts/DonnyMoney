package com.web.spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class DonnyMoneyApplication {

	public static void main(String[] args) {
		SpringApplication.run(DonnyMoneyApplication.class, args);
	}

}
