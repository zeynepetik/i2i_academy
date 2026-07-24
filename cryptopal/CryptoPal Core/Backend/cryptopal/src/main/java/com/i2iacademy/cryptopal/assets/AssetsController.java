package com.i2iacademy.cryptopal.assets;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetsController {
    private final AssetsService assetService;
    public AssetsController(AssetsService assetService){
        this.assetService=assetService;
    }

    @GetMapping
    public List<Assets> getAllAssets(){
        return assetService.getAllAssets();
    }
}
