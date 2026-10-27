package com.project.Habitude.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Habit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_habit_user"))
    @JsonIgnore
    private User user;

    @NotBlank(message = "Title is required")
    @Size(max = 30)
    @Column(length = 30)
    private String title;

    @Size(max = 150)
    @Column(length = 150)
    private String description;


    @Enumerated(EnumType.STRING)
    private HabitFrequency frequency;

    private Double targetValue;

    private String customUnit;

    private Integer currentStreak;

    private Integer longestStreak;

    private Instant lastCompletedAt;

    @Enumerated(EnumType.STRING)
    private HabitStatus status;

    @Enumerated(EnumType.STRING)
    private HabitType habitType;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @JsonIgnore
    @OneToMany(mappedBy = "habit")
    private List<Activity> activities;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "focus_id", nullable = false)
    private Focus focus;


    // later for the recommendations feature
//    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
//    @JsonIgnore
//    private List<Recommendation> recommendations = new ArrayList<>();
}

