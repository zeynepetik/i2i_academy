package com.i2iacademy.cryptopal.market_data;

import jakarta.persistence.*;
import java.util.UUID;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

/*rediten alınacak kalıcı olmayan değerlerin saklanması(?) için entity oluştur */
@Entity
public class PriceHistory {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    @Column(name="price_id")
    private UUID priceId;

    @Column(name="symbol", nullable=false)
    private String symbol;

    @Column(name="price", nullable=false)
    private BigDecimal price;

    @Column(name="created_at", nullable=false)
    private OffsetDateTime createdAt;

    public PriceHistory(){}

    public PriceHistory(UUID priceId,String symbol, BigDecimal price, OffsetDateTime createdAt){
        this.priceId=priceId;
        this.symbol=symbol;
        this.price=price;
        this.createdAt=createdAt;
    }

    public UUID getPriceId(){
        return priceId;
    }

    public String getSymbol(){
        return symbol;
    }

    public void setSymbol(String symbol){
        this.symbol=symbol;
    }

    public BigDecimal getPrice(){
        return price;
    }

    public void setPrice(BigDecimal price){
        this.price=price;
    }

    public OffsetDateTime getCreatedAt(){
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt){
        this.createdAt=createdAt;
    }
}
