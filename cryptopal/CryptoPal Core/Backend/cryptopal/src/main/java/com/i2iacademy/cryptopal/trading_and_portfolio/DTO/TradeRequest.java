package com.i2iacademy.cryptopal.trading_and_portfolio.DTO;

import java.math.BigDecimal;

public record TradeRequest(String symbol, BigDecimal quantity) {

}
