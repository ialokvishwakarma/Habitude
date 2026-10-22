package com.project.Habitude.analytics.dto;

import com.project.Habitude.model.ComparisonType;
import com.project.Habitude.model.ReferenceCategory;
import com.project.Habitude.model.ReferenceUnit;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecommendationDTO {
    private ReferenceCategory referenceCategory;
    private ReferenceUnit referenceUnit;
    private Double actualValue;
    private Double referenceValue;

    private ComparisonType comparisonType;

    private String message;
}
