package com.i2iacademy.cryptopal.assets;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AssetsService {
    private final AssetsRepository assetRepository;

    public AssetsService(AssetsRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public List<Assets> getAllAssets() {
        return assetRepository.findAll();
    }
}
