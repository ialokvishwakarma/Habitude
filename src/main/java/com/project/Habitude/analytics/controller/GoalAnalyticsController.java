package com.project.Habitude.analytics.controller;

import com.project.Habitude.analytics.dto.GoalAnalyticsResponseDTO;
import com.project.Habitude.analytics.service.GoalAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class GoalAnalyticsController {

    private final GoalAnalyticsService goalAnalyticsService;

    @GetMapping("/goals")
    public GoalAnalyticsResponseDTO getGoalAnalytics(
            Authentication authentication) {

        String email = authentication.getName();

        return goalAnalyticsService.getGoalAnalytics(email);
    }
}