package com.i2iacademy.cryptopal.users.DTO;

import java.math.BigDecimal;
import java.util.UUID;

public record UserResponse(UUID userid, String username, BigDecimal cashBalance, String token) {

}
