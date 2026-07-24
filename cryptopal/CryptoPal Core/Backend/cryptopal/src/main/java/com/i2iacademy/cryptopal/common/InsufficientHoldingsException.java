package com.i2iacademy.cryptopal.common;

public class InsufficientHoldingsException extends RuntimeException{
    public InsufficientHoldingsException(String message){
        super(message);
    }
}
