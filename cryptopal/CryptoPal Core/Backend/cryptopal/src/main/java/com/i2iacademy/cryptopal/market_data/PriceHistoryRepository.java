package com.i2iacademy.cryptopal.market_data;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PriceHistoryRepository extends JpaRepository<PriceHistory, UUID>{

}
