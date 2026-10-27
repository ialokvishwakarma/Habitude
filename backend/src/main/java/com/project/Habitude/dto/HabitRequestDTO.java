package com.project.Habitude.dto;

import com.project.Habitude.model.ActivityCategory;

import com.project.Habitude.model.HabitFrequency;
import com.project.Habitude.model.HabitType;
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
public class HabitRequestDTO {
    @NotBlank
    private String title;
    private String description;
    @NotNull
    private Long focusId;
    @NotNull
    private HabitFrequency frequency;
    @Positive
    private Double targetValue;
    private String customUnit;
    private HabitType habitType;

}
