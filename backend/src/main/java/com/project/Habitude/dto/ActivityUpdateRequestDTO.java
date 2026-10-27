package com.project.Habitude.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityUpdateRequestDTO {

    @NotBlank(message = "Title is required")
    @Size(max = 30)
    private String title;

    @Size(max = 150)
    private String description;

    @NotNull(message = "Value is required")
    @Positive(message = "Value must be greater than zero")
    private Double value;

    @NotNull(message = "Focus is required")
    private Long focusId;
}