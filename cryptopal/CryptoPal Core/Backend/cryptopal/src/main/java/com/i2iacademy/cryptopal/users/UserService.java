package com.i2iacademy.cryptopal.users;

import org.springframework.stereotype.Service;

import com.i2iacademy.cryptopal.users.DTO.*;
import com.i2iacademy.cryptopal.Redis.*;

import org.springframework.security.crypto.password.PasswordEncoder;
/*data işleme için kullanılacak libs */

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.OffsetDateTime;

import com.i2iacademy.cryptopal.Redis.SessionService;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SessionService sessionService;

    public UserService(PasswordEncoder passwordEncoder, UserRepository userRepository, SessionService sessionService){
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
        this.sessionService=sessionService;
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUserName(request.username())) {
            throw new IllegalArgumentException("Username already taken");
        }

        User user = new User();
        user.setUserName(request.username());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setCash(generateRandomStartingBalance());
        user.setCreatedAt(OffsetDateTime.now());

        User saved = userRepository.save(user);

        return new UserResponse(saved.getUserId(), saved.getUserName(), saved.getCash(), null);
    }

    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByUserName(request.username())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        SessionData sessionData= new SessionData(user.getUserId(), user.getUserName());
        String token=sessionService.generateAndStoreToken(sessionData);

        return new UserResponse(user.getUserId(), user.getUserName(), user.getCash(),token);
    }

    private BigDecimal generateRandomStartingBalance() {
        double min = 1000.0;
        double max = 10000.0;
        double randomValue = min + new SecureRandom().nextDouble() * (max - min);
        return BigDecimal.valueOf(randomValue).setScale(2, java.math.RoundingMode.HALF_UP);
    }

    public UserResponse getUserInfo(java.util.UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return new UserResponse(user.getUserId(), user.getUserName(), user.getCash(), null);
    }
}