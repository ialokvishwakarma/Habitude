package com.project.Habitude.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FocusResponseDTO implements Serializable {
    private Long id;
    private String name;
}
