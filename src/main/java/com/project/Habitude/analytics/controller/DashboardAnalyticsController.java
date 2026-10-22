package com.project.Habitude.analytics.controller;

import com.project.Habitude.analytics.dto.DashboardAnalyticsResponseDTO;
import com.project.Habitude.analytics.service.DashboardAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class DashboardAnalyticsController {

    private final DashboardAnalyticsService dashboardAnalyticsService;

    @GetMapping("/dashboard")
    public DashboardAnalyticsResponseDTO getDashboardAnalytics(
            Authentication authentication) {

        String email = authentication.getName();

        return dashboardAnalyticsService.getDashboardAnalytics(email);
    }
}