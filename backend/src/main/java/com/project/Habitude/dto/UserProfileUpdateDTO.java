package com.project.Habitude.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileUpdateDTO implements Serializable {
    @NotBlank(message = "First name is required")
    private String firstName;

    private String lastName;

    @Min(value = 10, message = "Age must be at least 10")
    @Max(value = 120, message = "Age must be valid")
    private Integer age;
}