package com.project.Habitude.dto;

import com.project.Habitude.model.ActivityCategory;
import com.project.Habitude.model.GoalStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoalResponseDTO implements Serializable {
    private Long userId;
    private Long id;
    private String title;
    private String description;
    private String focusName;
    private GoalStatus status;
    private boolean isActive;
    private Double targetValue;
    private String customUnit;
    private Double totalProgress;
    private LocalDate startDate;
    private LocalDate endDate;
}
