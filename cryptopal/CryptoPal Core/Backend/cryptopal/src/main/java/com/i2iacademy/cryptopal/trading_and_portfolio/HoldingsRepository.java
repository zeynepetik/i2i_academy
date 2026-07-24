package com.i2iacademy.cryptopal.trading_and_portfolio;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import jakarta.persistence.LockModeType;

@Repository
public interface HoldingsRepository extends JpaRepository<Holdings, UUID>{
    Optional<Holdings> findByUser_userIdAndAsset_assetId(UUID userId, UUID assetId);

    List<Holdings> findByUser_UserId(UUID userId);

    /*pessimistic locking: race condition engelleme, bir transaction bititrene kadar diğerlerini bekle */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT h FROM Holdings h WHERE h.user.userId=:userId AND h.asset.assetId=:assetId")
    Optional<Holdings> findByUserAndAssetForUpdate(@Param("userId") UUID userId, @Param("assetId") UUID assetId);
}
