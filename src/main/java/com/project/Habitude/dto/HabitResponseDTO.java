package com.project.Habitude.dto;

import com.project.Habitude.model.HabitFrequency;
import com.project.Habitude.model.HabitStatus;
import com.project.Habitude.model.HabitType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HabitResponseDTO implements Serializable {
    private Long userId;
    private Long id;
    private String title;
    private String description;
    private String focusName;

    private HabitFrequency frequency;
    private Double targetValue;
    private String customUnit;

    private Integer currentStreak;

    private Integer longestStreak;

    private Instant lastCompletedAt;

    private HabitStatus status;

    private HabitType habitType;
}
