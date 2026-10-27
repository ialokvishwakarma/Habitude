package com.project.Habitude.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    @Email(message = "Invalid Email")
    @NotBlank(message = "Email Required")
    private String email;
    @NotBlank(message = "Enter Password")
    private String password;
}
