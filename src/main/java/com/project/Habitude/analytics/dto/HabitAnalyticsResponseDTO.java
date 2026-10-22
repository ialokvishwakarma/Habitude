package com.project.Habitude.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitAnalyticsResponseDTO {
    private long totalHabits;
    private long activeHabits;
    private long completedHabits;
    private long pausedHabits;
    private double averageCurrentStreak;
    private long longestStreak;
    private Map<String, Long> habitsByType;
    private Map<String, Long> habitsByFocus;
}