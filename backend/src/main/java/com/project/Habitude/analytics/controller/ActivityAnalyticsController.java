package com.project.Habitude.analytics.controller;

import com.project.Habitude.analytics.dto.ActivityAnalyticsResponseDTO;
import com.project.Habitude.analytics.service.ActivityAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class ActivityAnalyticsController {

    private final ActivityAnalyticsService activityAnalyticsService;

    @GetMapping("/activities")
    public ActivityAnalyticsResponseDTO getActivityAnalytics(
            Authentication authentication) {

        String email = authentication.getName();

        return activityAnalyticsService.getActivityAnalytics(email);
    }
}