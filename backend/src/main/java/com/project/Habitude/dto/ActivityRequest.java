package com.project.Habitude.dto;

import com.project.Habitude.model.ReferenceCategory;
import com.project.Habitude.model.ReferenceUnit;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityRequest {
    @NotBlank
    private String title;
    private String description;

    private Long focusId;
    @Positive
    private Double value;
    private String customUnit;

    private ReferenceCategory referenceCategory;
    private ReferenceUnit referenceUnit;

    @NotNull
    private Instant activityDateTime;
    private Long habitId;
}
