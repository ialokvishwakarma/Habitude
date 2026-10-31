package com.project.Habitude.security;

import com.project.Habitude.dto.LoginResponse;
import com.project.Habitude.service.AuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class Oauth2SuccessHandler implements AuthenticationSuccessHandler {

    private final AuthService authService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = token.getPrincipal();

        LoginResponse loginResponse = authService.handleOauth2LoginRequest(oAuth2User, "google");

        String targetUrl = UriComponentsBuilder.fromUriString("https://habitude-eight.vercel.app")
                .queryParam("token", loginResponse.getToken())
                .queryParam("refreshToken", loginResponse.getRefreshToken())
                .build().toUriString();

        response.sendRedirect(targetUrl);
    }
}