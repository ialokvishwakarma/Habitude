package com.project.Habitude.dto;

import com.project.Habitude.model.GoalStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class GoalStatusRequest {
    private GoalStatus status;
}
