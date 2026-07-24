package com.i2iacademy.cryptopal.ai_insights;

import com.i2iacademy.cryptopal.ai_insights.DTO.AiInsightRequest;
import com.i2iacademy.cryptopal.ai_insights.DTO.AiInsightResponse;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai_insights")
public class AiInsightController {
    private final ContextEnrichmentService contextEnrichmentService;

    public AiInsightController(ContextEnrichmentService contextEnrichmentService) {
        this.contextEnrichmentService = contextEnrichmentService;
    }

    @PostMapping("/{userId}/query")
    public AiInsightResponse query(@PathVariable UUID userId, @RequestBody AiInsightRequest request) {
        String insight = contextEnrichmentService.generateInsight(userId, request.question());
        return new AiInsightResponse(insight);
    }
}
