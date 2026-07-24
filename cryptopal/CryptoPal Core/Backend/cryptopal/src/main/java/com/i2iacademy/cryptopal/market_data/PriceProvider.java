package com.i2iacademy.cryptopal.market_data;

import java.math.BigDecimal;
import java.util.Map;

public interface PriceProvider {
    Map<String, BigDecimal> generatePrices();
    BigDecimal getCurrentPrice(String symbol);
}
