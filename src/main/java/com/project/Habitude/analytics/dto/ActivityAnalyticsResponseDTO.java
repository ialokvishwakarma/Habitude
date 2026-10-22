package com.project.Habitude.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityAnalyticsResponseDTO {

    private long totalActivities;

    private Map<String, Long> activitiesByFocus;

    private Map<String, Long> activitiesByReferenceCategory;

    private Map<String, Double> valueByUnit;
}