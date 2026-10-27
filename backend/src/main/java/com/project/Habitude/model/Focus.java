package com.project.Habitude.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"name", "user_id"}
        )
)
public class Focus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "focus")
    private List<Activity> activities = new ArrayList<>();

    @OneToMany(mappedBy = "focus")
    private List<Habit> habits = new ArrayList<>();

    @OneToMany(mappedBy = "focus")
    private List<Goal> goals = new ArrayList<>();
}
