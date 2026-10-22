package com.project.Habitude.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponseDTO {

    // Personal details (Roles removed)
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Integer age;
    private LocalDateTime memberSince;

    // Performance snapshot metrics
    private long totalActivitiesLogged;
    private long totalActiveHabits;
    private long longestStreak;
    private double averageGoalProgress;
}