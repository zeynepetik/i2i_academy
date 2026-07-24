package com.i2iacademy.cryptopal.market_data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Map;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PriceScheduler {
    private final PriceProvider priceProvider;
    private final RedisTemplate<String, Object> redisTemplate;
    private final PriceHistoryRepository priceHistoryRepository;

    public PriceScheduler(PriceProvider priceProvider,
                           RedisTemplate<String, Object> redisTemplate,
                           PriceHistoryRepository priceHistoryRepository) {
        this.priceProvider = priceProvider;
        this.redisTemplate = redisTemplate;
        this.priceHistoryRepository = priceHistoryRepository;
    }

    // her 15 saniyede yeni fiyat üret, Redis'e yaz (sadece son değer)
    @Scheduled(fixedRate = 15000)
    public void updatePrices() {
        Map<String, BigDecimal> prices = priceProvider.generatePrices();

        for (Map.Entry<String, BigDecimal> entry : prices.entrySet()) {
            String redisKey = "price:" + entry.getKey();
            redisTemplate.opsForValue().set(redisKey, entry.getValue());
        }
    }

    // her 60 saniyede: Redis'teki güncel değerleri oku, price_history'ye yaz
    @Scheduled(fixedRate = 60000)
    public void snapshotPriceHistory() {
        for (String symbol : new String[]{"BTC", "ETH"}) {
            Object value = redisTemplate.opsForValue().get("price:" + symbol);
            if (value == null) continue; // henüz fiyat üretilmemiş olabilir

            BigDecimal price = new BigDecimal(value.toString());

            PriceHistory record = new PriceHistory();
            record.setSymbol(symbol);
            record.setPrice(price);
            record.setCreatedAt(OffsetDateTime.now());

            priceHistoryRepository.save(record);
        }
    }
}
