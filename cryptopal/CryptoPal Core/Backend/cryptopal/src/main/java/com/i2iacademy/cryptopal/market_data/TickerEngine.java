package com.i2iacademy.cryptopal.market_data;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class TickerEngine implements PriceProvider{
    private final Map<String, BigDecimal> lastPrices=new ConcurrentHashMap<>();
    private final RedisTemplate<String, Object> redisTemplate;

    public TickerEngine(RedisTemplate<String, Object> redisTemplate){
        this.redisTemplate=redisTemplate;
        lastPrices.put("BTC", BigDecimal.valueOf(60000));
        lastPrices.put("ETH", BigDecimal.valueOf(3000));
    }

    @Override
    public Map<String, BigDecimal> generatePrices() {
        Map<String, BigDecimal> newPrices = new HashMap<>();

        for (Map.Entry<String, BigDecimal> entry : lastPrices.entrySet()) {
            String symbol = entry.getKey();
            BigDecimal previous = entry.getValue();

            // -%2 ile +%2 arasında rastgele bir değişim oranı
            double changePercent = ThreadLocalRandom.current().nextDouble(-0.02, 0.02);
            BigDecimal changeFactor = BigDecimal.valueOf(1 + changePercent);

            BigDecimal newPrice = previous.multiply(changeFactor)
                    .setScale(2, RoundingMode.HALF_UP);

            newPrices.put(symbol, newPrice);
            lastPrices.put(symbol, newPrice); // bir sonraki üretim için güncelle
        }

        return newPrices;
    }

    @Override
    public BigDecimal getCurrentPrice(String symbol){
        //System.out.println("Redis'te aranan key: [price:" + symbol + "]");
        Object value=redisTemplate.opsForValue().get("price:" +symbol);
        System.out.println("Redis'ten dönen ham değer: " + value + " (tip: " + (value != null ? value.getClass() : "null") + ")");
        if(value==null){
            throw new IllegalArgumentException("Could not find the price: "+ symbol);
        }

        return (BigDecimal) value;
    }
}
