package com.i2iacademy.cryptopal.trading_and_portfolio;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID>{
    /*_ sonrası userId userdaki userId ye erişmenin yolu o yüzden oradakiyle aynı olmalı */
    List<Transaction> findByUser_UserIdOrderByCreatedAtDesc(UUID userId);
    
}
