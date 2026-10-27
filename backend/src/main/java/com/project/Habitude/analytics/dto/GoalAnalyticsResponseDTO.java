package com.project.Habitude.analytics.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoalAnalyticsResponseDTO {
    private long totalGoals;
    private long activeGoals;
    private long completedGoals;
    private long notStartedGoals;
    private double averageProgress;
    private Map<String, Long> goalsByFocus;
}