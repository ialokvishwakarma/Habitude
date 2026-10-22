package com.project.Habitude.ai_recommendation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityContextDTO {
    private String focus;

    private LocalDate startDate;
    private LocalDate endDate;
    private Long totalActivities;
    private Double totalHours;
    private Double totalMinutes;
    private Long activeDays;
}