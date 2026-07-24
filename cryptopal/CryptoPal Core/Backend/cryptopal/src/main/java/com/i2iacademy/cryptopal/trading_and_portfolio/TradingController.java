package com.i2iacademy.cryptopal.trading_and_portfolio;

import com.i2iacademy.cryptopal.trading_and_portfolio.DTO.TradeRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trading")
public class TradingController {
    private final TradingService tradingService;
    private final TransactionRepository transactionRepository;
    private final HoldingsRepository holdingRepository;

    public TradingController(TradingService tradingService,
                              TransactionRepository transactionRepository,
                              HoldingsRepository holdingRepository) {
        this.tradingService = tradingService;
        this.transactionRepository = transactionRepository;
        this.holdingRepository = holdingRepository;
    }

    @PostMapping("/{userId}/buy")
    public ResponseEntity<Transaction> buy(@PathVariable UUID userId, @RequestBody TradeRequest request) {
        return ResponseEntity.ok(tradingService.buy(userId, request.symbol(), request.quantity()));
    }

    @PostMapping("/{userId}/sell")
    public ResponseEntity<Transaction> sell(@PathVariable UUID userId, @RequestBody TradeRequest request) {
        return ResponseEntity.ok(tradingService.sell(userId, request.symbol(), request.quantity()));
    }
    /*Tüm holdingleri çekip filtereliyor düzeltilecek */
    @GetMapping("/{userId}/portfolio")
    public ResponseEntity<List<Holdings>> getPortfolio(@PathVariable UUID userId) {
        return ResponseEntity.ok(holdingRepository.findAll().stream()
                .filter(h -> h.getUser().getUserId().equals(userId))
                .toList());
    }

    @GetMapping("/{userId}/history")
    public ResponseEntity<List<Transaction>> getHistory(@PathVariable UUID userId) {
        return ResponseEntity.ok(transactionRepository.findByUser_UserIdOrderByCreatedAtDesc(userId));
    }

}
