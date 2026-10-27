package com.project.Habitude.service;

import com.project.Habitude.exceptions.RefreshNotFoundException;
import com.project.Habitude.exceptions.UserNotFoundException;
import com.project.Habitude.model.RefreshToken;
import com.project.Habitude.model.User;
import com.project.Habitude.repository.RefreshTokenRepository;
import com.project.Habitude.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    @Value("${security.refreshTokenExpiration}")
    private  Long refreshTokenDuration;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;


    public RefreshToken createRefreshToken(String email){
//        var token = new RefreshToken();
        User user = userRepository.findByEmail(email);
        if(user==null){
            throw new UserNotFoundException("User not found");
        }
        RefreshToken token = refreshTokenRepository.findByUser(user);
        if(token == null){
            token = new RefreshToken();
            token.setUser(user);
        }
        token.setExpirationTime(Instant.now().plusMillis(refreshTokenDuration));
        token.setToken(UUID.randomUUID().toString());
        return refreshTokenRepository.save(token);
    }

    public boolean isExpired(RefreshToken token){
        return token.getExpirationTime().isBefore(Instant.now());
    }

    public RefreshToken findByToken(String token){
        return refreshTokenRepository.findByToken(token).orElseThrow(
                ()-> new RefreshNotFoundException("Refresh token not found")
        );
    }
}
