package com.project.Habitude.analytics.dto;

import com.project.Habitude.model.ReferenceCategory;
import com.project.Habitude.model.ReferenceUnit;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ActivityReferenceAnalyticsDTO {
    private Integer age;
    private ReferenceCategory referenceCategory;
    private ReferenceUnit referenceUnit;
    private Double totalValue;
//    private Double avgValue;
}
