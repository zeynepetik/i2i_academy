package com.i2iacademy.cryptopal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CryptopalApplication {

	public static void main(String[] args) {
		SpringApplication.run(CryptopalApplication.class, args);
	}

}
