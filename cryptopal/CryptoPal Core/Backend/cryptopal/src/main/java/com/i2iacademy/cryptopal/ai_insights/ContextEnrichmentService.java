package com.i2iacademy.cryptopal.ai_insights;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.i2iacademy.cryptopal.market_data.PriceProvider;
import com.i2iacademy.cryptopal.trading_and_portfolio.Holdings;
import com.i2iacademy.cryptopal.trading_and_portfolio.HoldingsRepository;
import com.i2iacademy.cryptopal.trading_and_portfolio.Transaction;
import com.i2iacademy.cryptopal.trading_and_portfolio.TransactionRepository;

@Service
public class ContextEnrichmentService {
    private final HoldingsRepository holdingsRepository;
    private final TransactionRepository transactionRepository;
    private final GeminiClient geminiClient;
    // TODO: PriceProvider'ını buraya inject et
    private final PriceProvider priceProvider;

    public ContextEnrichmentService(HoldingsRepository holdingsRepository,
                                     TransactionRepository transactionRepository,
                                     GeminiClient geminiClient, PriceProvider priceProvider) {
        this.holdingsRepository = holdingsRepository;
        this.transactionRepository = transactionRepository;
        this.geminiClient = geminiClient;
        this.priceProvider=priceProvider;
    }

    public String generateInsight(UUID userId, String question) {
        List<Holdings> holdings = holdingsRepository.findByUser_UserId(userId);
        List<Transaction> transactions = transactionRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);

        StringBuilder context = new StringBuilder();
        context.append("Kullanıcının mevcut portföyü:\n");
        for (Holdings h : holdings) {
            var currentPrice=priceProvider.getCurrentPrice(h.getAsset().getSymbol());
            context.append("- ").append(h.getAsset().getSymbol())
                    .append(": ").append(h.getQuantity()).append(" number, updated price: ")
                    .append(currentPrice).append("\n");
        }

        context.append("\nSon işlemler:\n");
        transactions.stream().limit(10).forEach(t ->
                context.append("- ").append(t.getTransactionType()).append(" ")
                        .append(t.getQuantity()).append(" ").append(t.getAsset().getSymbol())
                        .append(" @ ").append(t.getPaidPerPrice()).append("\n")
        );

        String prompt = context +
                "\nKullanıcının sorusu: " + question +
                "\n\nBu verilere dayanarak kısa, anlaşılır bir analiz yap.";

        return geminiClient.generateInsight(prompt);
    }
}
