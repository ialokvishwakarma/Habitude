package com.project.Habitude.ai_recommendation;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;


@RestController
@RequestMapping("/api/ai-recommendation")
@RequiredArgsConstructor
public class AIRecommendationController {

    private final AIRecommendationService recommendationService;

    @PostMapping("/activity")
    public String getActivityRecommendation(
            @RequestParam Long focusId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate,
            Authentication authentication) {

        return recommendationService.generateActivityRecommendation(
                authentication.getName(),
                focusId,
                startDate,
                endDate
        );
    }
}
