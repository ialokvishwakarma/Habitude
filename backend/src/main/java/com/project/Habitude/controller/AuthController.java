package com.project.Habitude.controller;


import com.project.Habitude.dto.*;
import com.project.Habitude.model.RefreshToken;
import com.project.Habitude.repository.RefreshTokenRepository;
import com.project.Habitude.security.JwtUtils;
import com.project.Habitude.service.RefreshTokenService;
import com.project.Habitude.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final AuthService authService;

    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtils jwtUtils;

    public AuthController(AuthService authService, RefreshTokenService refreshTokenService, RefreshTokenRepository refreshTokenRepository, JwtUtils jwtUtils) {
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody UserRequest userRequest){
        log.info("Register Request");
        return ResponseEntity.ok(authService.register(userRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest){
        log.info("Login Request");
        LoginResponse response = authService.login(loginRequest);
        if(response==null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refreshToken(
            @RequestBody RefreshRequest refreshRequest
            ){
        log.info("Refresh Token Request");
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshRequest.getRefreshToken()).orElseThrow();
//        String refreshToken = refreshRequest.getRefreshToken();
        if(refreshTokenService.isExpired(refreshToken)){
            refreshTokenRepository.delete(refreshToken);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String jwtToken = jwtUtils.generateTokenFromEmail(refreshToken.getUser().getEmail(),refreshToken.getUser().getRole().name());
        RefreshResponse response = new RefreshResponse();
        response.setAccessToken(jwtToken);
        return ResponseEntity.ok(response);
    }

    // for testing ADMIN role access
    @GetMapping("/admin/dashboard")
    public String dashBoard(){
        return "At the dashboard page";
    }

}
