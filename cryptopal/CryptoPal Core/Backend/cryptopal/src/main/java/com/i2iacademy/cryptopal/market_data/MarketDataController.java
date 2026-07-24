package com.i2iacademy.cryptopal.market_data;

import java.util.HashMap;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import com.i2iacademy.cryptopal.Redis.*;

@RestController
@RequestMapping("/api/market_data")
public class MarketDataController {
    private final RedisTemplate<String, Object> redisTemplate;

    public MarketDataController(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @GetMapping("/prices")
    public ResponseEntity<Map<String, Object>> getPrices() {
        Map<String, Object> prices = new HashMap<>();
        for (String symbol : new String[]{"BTC", "ETH"}) {
            Object value = redisTemplate.opsForValue().get("price:" + symbol);
            prices.put(symbol, value);
        }
        return ResponseEntity.ok(prices);
    }
}
