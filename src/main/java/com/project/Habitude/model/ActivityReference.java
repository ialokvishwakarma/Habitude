package com.project.Habitude.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@RequiredArgsConstructor
@Getter
@Setter
public class ActivityReference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private  ReferenceCategory referenceCategory;

    @Enumerated(EnumType.STRING)
    private ReferenceUnit referenceUnit;

    private Integer minAge;
    private Integer maxAge;

    private BigDecimal referenceValue;

    @Enumerated(EnumType.STRING)
    private ComparisonType comparisonType;
}
