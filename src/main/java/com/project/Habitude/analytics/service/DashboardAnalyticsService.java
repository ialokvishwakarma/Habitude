package com.project.Habitude.analytics.service;

import com.project.Habitude.analytics.dto.ActivityAnalyticsResponseDTO;
import com.project.Habitude.analytics.dto.DashboardAnalyticsResponseDTO;
import com.project.Habitude.analytics.dto.GoalAnalyticsResponseDTO;
import com.project.Habitude.analytics.dto.HabitAnalyticsResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardAnalyticsService {

    private final GoalAnalyticsService goalAnalyticsService;
    private final HabitAnalyticsService habitAnalyticsService;
    private final ActivityAnalyticsService activityAnalyticsService;

    public DashboardAnalyticsResponseDTO getDashboardAnalytics(String email) {

         GoalAnalyticsResponseDTO goalAnalytics =
                goalAnalyticsService.getGoalAnalytics(email);

        HabitAnalyticsResponseDTO habitAnalytics =
                habitAnalyticsService.getHabitAnalytics(email);

        ActivityAnalyticsResponseDTO activityAnalytics =
                 activityAnalyticsService.getActivityAnalytics(email);

        return new DashboardAnalyticsResponseDTO(
                goalAnalytics,
                habitAnalytics,
                activityAnalytics
          );
      }
}