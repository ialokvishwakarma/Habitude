package com.project.Habitude.security;


import com.project.Habitude.exceptions.UnSupportedOAuthProvideException;
import com.project.Habitude.model.AuthProviderType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    @Value("${security.jwtKey}")
    private String jwtSecret;

    @Value("${security.expirationTime}")
    private int jwtExpirationTime;

    public String getJwtFromHeader(HttpServletRequest request){
        String bearerToken = request.getHeader("Authorization");
        if(bearerToken!=null && bearerToken.startsWith("Bearer ")) return bearerToken.substring(7);
        return null;
    }

    public String generateTokenFromEmail(String email,String role){
//        System.out.println("JWT SECRET USED (generate): " + jwtSecret);
        return Jwts.builder()
                .setSubject(email)
                .claim("roles",role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + jwtExpirationTime))
                .signWith(key(),SignatureAlgorithm.HS256)
                .compact();
    }

    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }


    public String extractEmail(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Claims getAllClaims(String jwt) {

        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(jwt)
                .getBody();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token); // if invalid → exception

            return true;

        } catch (Exception e) {
            return false;
        }
    }

    public AuthProviderType getProviderTypeFromRegistrationId(String registrationId){
        return
                switch (registrationId.toLowerCase()) {
                    case "google" -> AuthProviderType.GOOGLE;
                    case "github" -> AuthProviderType.GITHUB;
                    case "facebook" -> AuthProviderType.FACEBOOK;
                    default ->
                            throw new UnSupportedOAuthProvideException("Unsupported OAuth2 Provider" + registrationId);
                };
    }

    public String getProviderIdFromOAuth2User(OAuth2User oAuth2User, String registrationId) {
        String providerId = switch (registrationId.toLowerCase()){
            case "google" -> oAuth2User.getAttribute("sub");
            case "github" -> oAuth2User.getAttribute("id");
            default -> throw new UnSupportedOAuthProvideException("Unsupported OAuth2 Provider");
        };
        if(providerId==null || providerId.isBlank()) throw new IllegalArgumentException("Unable to determine provider Id for OAuth2 Login");
        return providerId;
    }
}
