package com.i2iacademy.cryptopal.trading_and_portfolio;

import com.i2iacademy.cryptopal.assets.Assets;
import com.i2iacademy.cryptopal.assets.AssetsRepository;
import com.i2iacademy.cryptopal.common.InsufficientFundsException;
import com.i2iacademy.cryptopal.common.InsufficientHoldingsException;
import com.i2iacademy.cryptopal.users.User;
import com.i2iacademy.cryptopal.users.UserRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class TradingService {
    private final HoldingsRepository holdingRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final AssetsRepository assetRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    public TradingService(HoldingsRepository holdingRepository,
                           TransactionRepository transactionRepository,
                           UserRepository userRepository,
                           AssetsRepository assetRepository,
                           RedisTemplate<String, Object> redisTemplate) {
        this.holdingRepository = holdingRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.assetRepository = assetRepository;
        this.redisTemplate = redisTemplate;
    }

    @Transactional
    public Transaction buy(UUID userId, String symbol, BigDecimal quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Assets asset = assetRepository.findBySymbol(symbol)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found"));

        BigDecimal currentPrice = getCurrentPrice(symbol);
        BigDecimal totalCost = currentPrice.multiply(quantity).setScale(2, RoundingMode.HALF_UP);

        if (user.getCash().compareTo(totalCost) < 0) {
            throw new InsufficientFundsException("Insufficient funds");
        }

        // bakiyeyi düş
        user.setCash(user.getCash().subtract(totalCost));
        userRepository.save(user);

        // holding'i kilitli oku (varsa), yoksa yeni oluştur
        Holdings holding = holdingRepository
                .findByUserAndAssetForUpdate(userId, asset.getAssetId())
                .orElseGet(() -> {
                    Holdings h = new Holdings();
                    h.setUser(user);
                    h.setAsset(asset);
                    h.setQuantity(BigDecimal.ZERO);
                    h.setAvgCost(BigDecimal.ZERO);
                    return h;
                });

        // yeni ortalama maliyet hesabı
        BigDecimal existingQty = holding.getQuantity();
        BigDecimal existingTotalCost = holding.getAvgCost().multiply(existingQty);
        BigDecimal newTotalQty = existingQty.add(quantity);
        BigDecimal newAvgCost = existingTotalCost.add(totalCost)
                .divide(newTotalQty, 8, RoundingMode.HALF_UP);

        holding.setQuantity(newTotalQty);
        holding.setAvgCost(newAvgCost);
        holdingRepository.save(holding);

        // transaction kaydı
        Transaction tx = new Transaction();
        tx.setUser(user);
        tx.setAsset(asset);
        tx.setCreatedAt(OffsetDateTime.now());
        tx.setTransactionType(TransactionType.BUY);
        tx.setQuantity(quantity);
        tx.setPaidPerPrice(currentPrice);
        tx.setTotal(totalCost);

        return transactionRepository.save(tx);
    }

    @Transactional
    public Transaction sell(UUID userId, String symbol, BigDecimal quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Assets asset = assetRepository.findBySymbol(symbol)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found"));

        Holdings holding = holdingRepository
                .findByUserAndAssetForUpdate(userId, asset.getAssetId())
                .orElseThrow(() -> new InsufficientHoldingsException("No holdings for this asset"));

        if (holding.getQuantity().compareTo(quantity) < 0) {
            throw new InsufficientHoldingsException("Insufficient holdings");
        }

        BigDecimal currentPrice = getCurrentPrice(symbol);
        BigDecimal totalProceeds = currentPrice.multiply(quantity).setScale(2, RoundingMode.HALF_UP);

        // holding'i azalt (avg_cost değişmez, sadece quantity düşer)
        holding.setQuantity(holding.getQuantity().subtract(quantity));
        holdingRepository.save(holding);

        // bakiyeyi arttır
        user.setCash(user.getCash().add(totalProceeds));
        userRepository.save(user);

        Transaction tx = new Transaction();
        tx.setUser(user);
        tx.setAsset(asset);
        tx.setCreatedAt(OffsetDateTime.now());
        tx.setTransactionType(TransactionType.SELL);
        tx.setQuantity(quantity);
        tx.setPaidPerPrice(currentPrice);
        tx.setTotal(totalProceeds);

        return transactionRepository.save(tx);
    }

    private BigDecimal getCurrentPrice(String symbol) {
        Object value = redisTemplate.opsForValue().get("price:" + symbol);
        if (value == null) {
            throw new IllegalArgumentException("Price not available for " + symbol);
        }
        return new BigDecimal(value.toString());
    }
}







