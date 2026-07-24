package com.i2iacademy.cryptopal.users;

import jakarta.persistence.*;
import java.util.UUID;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "user_name",unique=true, nullable = false)
    private String userName;

    @Column(name="password_hash", nullable=false, unique=false, length=255)
    private String passwordHash;

    @Column(name = "cash", unique = false, nullable = false)
    private BigDecimal cash;

    @Column(name="created_at", nullable=false, unique=false)
    private OffsetDateTime createdAt;

    public User(){}

    public User(UUID userId, String userName, String passwordHash, BigDecimal cash, OffsetDateTime createdAt) {
        this.userId = userId;
        this.userName = userName;
        this.passwordHash = passwordHash;
        this.cash = cash;
        this.createdAt = createdAt;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPasswordHash(){
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public BigDecimal getCash() {
        return cash;
    }

    public void setCash(BigDecimal cash) {
        this.cash = cash;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
