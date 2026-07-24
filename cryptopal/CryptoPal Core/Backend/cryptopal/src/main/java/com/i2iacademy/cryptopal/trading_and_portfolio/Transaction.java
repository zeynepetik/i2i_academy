package com.i2iacademy.cryptopal.trading_and_portfolio;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

import com.i2iacademy.cryptopal.assets.Assets;
import com.i2iacademy.cryptopal.users.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    @Column(name="transaction_id")
    private UUID transactionId;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="asset_id", nullable=false)
    private Assets asset;

    @Column(name="created_at", nullable=false)
    private OffsetDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name="transaction_type", nullable=false, length=5)
    private TransactionType transactionType;

    @Column(name="quantity", nullable=false, precision=28, scale=10)
    private BigDecimal quantity;

    @Column(name="paid_per_price", nullable=false, precision=18, scale=8)
    private BigDecimal paidPerPrice;

    @Column(name="total", nullable=false, precision=18, scale=2)
    private BigDecimal total;

    public Transaction(){}

    public UUID getTransactionId() {
        return transactionId;
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

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPaidPerPrice() {
        return paidPerPrice;
    }

    public void setPaidPerPrice(BigDecimal paidPerPrice) {
        this.paidPerPrice = paidPerPrice;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
