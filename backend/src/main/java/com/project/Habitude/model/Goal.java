package com.project.Habitude.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Goal {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String title;

        private String description;

        @Enumerated(EnumType.STRING)
        private GoalStatus status = GoalStatus.NOT_STARTED;

        private Double targetValue;

        private Double totalProgress;

        private boolean isActive = true;

        private String customUnit;

        private LocalDate startDate;

        private LocalDate endDate;

        @CreationTimestamp
        private LocalDateTime createdAt;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "focus_id",nullable = false)
        private Focus focus;

        @ManyToOne(fetch = FetchType.LAZY)
        @JsonIgnore
        @JoinColumn(name = "user_id",nullable = false)
        private User user;
}
