package com.project.Habitude.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecommendationResponse {
    private Long userId;
    private Long activityId;
    private String activityType;
    private String recommendations;
    private List<String> suggestions;
    private List<String> improvements;
    private List<String> safety;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
