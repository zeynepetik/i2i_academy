package com.i2iacademy.cryptopal.assets;

import jakarta.persistence.*;
import java.util.UUID;
import java.time.OffsetDateTime;
import java.math.BigDecimal;

@Entity
@Table (name="assets")
public class Assets {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "asset_id")
    private UUID assetId;

    @Column(name = "asset_name",unique=true, nullable = false)
    private String assetName;

    @Column(name="tradable_quantity", nullable=false, unique=false)
    private BigDecimal tradableQuantity;

    @Column(name = "symbol", unique = true, nullable = false)
    private String symbol;

    @Column(name="created_at", nullable=false, unique=false)
    private OffsetDateTime createdAt;

    public Assets(){}

    public Assets(UUID assetId, String assetName, BigDecimal tradableQuantity, String symbol, OffsetDateTime createdAt) {
        this.assetId = assetId;
        this.assetName = assetName;
        this.tradableQuantity = tradableQuantity;
        this.symbol = symbol;
        this.createdAt = createdAt;
    }

    public UUID getAssetId() {
        return assetId;
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }

    public BigDecimal getTradableQuantity() {
        return tradableQuantity;
    }

    public void setTradableQuantity(BigDecimal tradableQuantity) {
        this.tradableQuantity = tradableQuantity;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
