package com.project.Habitude.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecommendationRequest {
    private Long userId;
    private Long activityId;
    private String reccomendations;
    private List<String> suggestions;
    private List<String> improvements;
    private List<String> safety;
}
