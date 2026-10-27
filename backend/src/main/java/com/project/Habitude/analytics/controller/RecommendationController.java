package com.project.Habitude.analytics.controller;

import com.project.Habitude.analytics.dto.RecommendationDTO;
import com.project.Habitude.analytics.service.RecommendationService;
import com.project.Habitude.model.User;
import com.project.Habitude.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final UserRepository userRepository;

    @GetMapping
    public List<RecommendationDTO> getRecommendations(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email);

        return recommendationService.getRecommendations(
                user,
                startDate,
                endDate
        );
    }
}