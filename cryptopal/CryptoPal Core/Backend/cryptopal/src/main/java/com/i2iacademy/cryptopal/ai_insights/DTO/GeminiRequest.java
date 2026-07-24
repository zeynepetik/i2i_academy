package com.i2iacademy.cryptopal.ai_insights.DTO;

import java.util.List;

public record GeminiRequest(List<Content> contents) {
    public record Content(List<Part> parts){}
    public record Part(String text){}
}
