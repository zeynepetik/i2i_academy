package com.i2iacademy.cryptopal.users;

import com.i2iacademy.cryptopal.users.DTO.RegisterRequest;
import com.i2iacademy.cryptopal.users.DTO.UserResponse;
import com.i2iacademy.cryptopal.users.DTO.LoginRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService){
        this.userService=userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request){
        UserResponse response=userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<UserResponse>login(@RequestBody LoginRequest request){
        UserResponse response=userService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserInfo(@PathVariable UUID userId){
        UserResponse response = userService.getUserInfo(userId);
        return ResponseEntity.ok(response);
    }
}
