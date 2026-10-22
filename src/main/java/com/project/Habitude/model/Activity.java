package com.project.Habitude.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @NotBlank(message = "Title is required")
    @Size(max = 30)
    @Column(length = 30)
    private String title;

    @Size(max = 150)
    @Column(length = 150)
    private String description;

   private Double value;

   private String customUnit;

   @Enumerated(EnumType.STRING)
   private ReferenceCategory referenceCategory;

   @Enumerated(EnumType.STRING)
   private ReferenceUnit referenceUnit;

    private Instant activityDateTime;

    @CreationTimestamp
    private LocalDateTime createdAt;


    // Database relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id",nullable = false, foreignKey = @ForeignKey(name = "fk_activity_user"))
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "habit_id")
    private Habit habit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "focus_id",nullable = false)
    private Focus focus;

//    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
//    @JsonIgnore
//    private List<Recommendation> recommendations = new ArrayList<>();
}

