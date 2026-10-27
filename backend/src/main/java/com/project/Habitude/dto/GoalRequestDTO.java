package com.project.Habitude.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoalRequestDTO {
    @Length(max = 50)
    private String title;

    @Length(max = 300)
    private String description;

    @NotNull
    private Long focusId;

    @Positive
    private Double targetValue;

    private String customUnit;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;
}
