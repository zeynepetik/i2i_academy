package com.i2iacademy.cryptopal.trading_and_portfolio;

import java.math.BigDecimal;
import java.util.UUID;

import com.i2iacademy.cryptopal.assets.Assets;
import com.i2iacademy.cryptopal.users.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(
    name="holdings"
    /* uniqueConstraints={
        @UniqueConstraints(
            columnNames={"user_id", "holding_id"}
        )
    } */
)
public class Holdings {
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    @Column(name="holding_id")
    private UUID holdingId;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Assets asset;

    @Column(name="avg_cost", nullable=false, precision=18, scale=8)
    private BigDecimal avgCost;

    @Column(name="quantity", nullable=false, precision=28, scale=10)
    private BigDecimal quantity;

    public Holdings(){}

     public UUID getHoldingId() {
        return holdingId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Assets getAsset() {
        return asset;
    }

    public void setAsset(Assets asset) {
        this.asset = asset;
    }

    public BigDecimal getAvgCost() {
        return avgCost;
    }

    public void setAvgCost(BigDecimal avgCost) {
        this.avgCost = avgCost;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }
}
