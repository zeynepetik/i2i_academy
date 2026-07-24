package com.i2iacademy.cryptopal.ai_insights.DTO;

import java.util.List;
/*içiçe recordlear response ve request arasında ayrım yapabilmek için gerekli  */
public record GeminiResponse(List<Candidate> candidates) {
    /*jsonda candidate altında tek content var */
    public record Candidate(Content content){}
    public record Content(List<Part> parts){}
    public record Part(String text){}
}
