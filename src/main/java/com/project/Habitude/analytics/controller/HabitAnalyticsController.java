package com.project.Habitude.analytics.controller;

import com.project.Habitude.analytics.dto.HabitAnalyticsResponseDTO;
import com.project.Habitude.analytics.service.HabitAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class HabitAnalyticsController {

    private final HabitAnalyticsService habitAnalyticsService;

    @GetMapping("/habits")
    public HabitAnalyticsResponseDTO getHabitAnalytics(
            Authentication authentication) {

        String email = authentication.getName();

        return habitAnalyticsService.getHabitAnalytics(email);
    }
}