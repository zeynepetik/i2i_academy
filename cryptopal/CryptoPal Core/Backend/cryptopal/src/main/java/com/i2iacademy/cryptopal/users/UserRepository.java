package com.i2iacademy.cryptopal.users;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUserName(String username);
    boolean existsByUserName(String username);
    /* User findById(UUID userId); */
}
