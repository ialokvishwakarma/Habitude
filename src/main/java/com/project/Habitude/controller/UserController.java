package com.project.Habitude.controller;

import com.project.Habitude.dto.UserProfileResponseDTO;
import com.project.Habitude.dto.UserProfileUpdateDTO;
import com.project.Habitude.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponseDTO> getProfile(Authentication authentication) {
        log.info("Fetching profile for user: {}", authentication.getName());
        return ResponseEntity.ok(userService.getUserProfile(authentication.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponseDTO> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UserProfileUpdateDTO updateDTO) {
        log.info("Updating profile for user: {}", authentication.getName());
        return ResponseEntity.ok(userService.updateProfile(authentication.getName(), updateDTO));
    }
}