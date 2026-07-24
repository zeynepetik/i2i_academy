package com.i2iacademy.cryptopal.assets;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssetsRepository extends JpaRepository<Assets, UUID> {
    Optional<Assets> findBySymbol(String symbol);
}
