package com.i2iacademy.cryptopal.ai_insights;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import java.util.List;
import com.i2iacademy.cryptopal.common.AiServiceUnavailableException;
import org.springframework.beans.factory.annotation.Value;
import com.i2iacademy.cryptopal.ai_insights.DTO.GeminiRequest;
import com.i2iacademy.cryptopal.ai_insights.DTO.GeminiResponse;

@Component
public class GeminiClient {
    private final RestClient geminiRestClient;
    private final String apiKey;
    private final String model;

    public GeminiClient(RestClient geminiRestClient,@Value("${gemini.api.key}") String apiKey,
                         @Value("${gemini.model}") String model) {
        this.geminiRestClient = geminiRestClient;
        this.apiKey = apiKey;
        this.model = model;
                         }
    
    public String generateInsight(String prompt) {
        GeminiRequest request = new GeminiRequest(
                List.of(new GeminiRequest.Content(
                        List.of(new GeminiRequest.Part(prompt))
                ))
        );

        try {
            GeminiResponse response = geminiRestClient.post()
                    .uri("/{model}:generateContent", model)
                    .header("x-goog-api-key", apiKey)
                    .body(request)
                    .retrieve()
                    .body(GeminiResponse.class);

            if (response == null || response.candidates() == null || response.candidates().isEmpty()) {
                throw new AiServiceUnavailableException("Gemini has returned null");
            }

            return response.candidates().get(0).content().parts().get(0).text();

        } catch (RestClientException e) {
            throw new AiServiceUnavailableException("Could not reach Gemini service", e);
        }
    }

}
