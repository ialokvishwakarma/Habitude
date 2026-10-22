package com.project.Habitude.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAnalyticsResponseDTO {
    private GoalAnalyticsResponseDTO goalAnalytics;
    private HabitAnalyticsResponseDTO habitAnalytics;
    private ActivityAnalyticsResponseDTO activityAnalytics;
}