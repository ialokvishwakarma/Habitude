package com.project.Habitude.service;

import com.project.Habitude.dto.UserProfileResponseDTO;
import com.project.Habitude.dto.UserProfileUpdateDTO;
import com.project.Habitude.model.Goal;
import com.project.Habitude.model.Habit;
import com.project.Habitude.model.HabitStatus;
import com.project.Habitude.model.User;
import com.project.Habitude.repository.ActivityRepository;
import com.project.Habitude.repository.GoalRepository;
import com.project.Habitude.repository.HabitRepository;
import com.project.Habitude.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@CacheConfig(cacheNames = "userProfiles")
public class UserService {

    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final HabitRepository habitRepository;
    private final GoalRepository goalRepository;

    @Transactional(readOnly = true)
    @Cacheable(key = "#email")
    public UserProfileResponseDTO getUserProfile(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }

        Long userId = user.getId();
        long totalActivities = activityRepository.countByUserId(userId);

        long activeHabits = habitRepository.countByUserIdAndStatus(userId, HabitStatus.ACTIVE);


        List<Habit> habits = habitRepository.findByUserId(userId);
        long longestStreak = 0;
        if (habits != null) {
            for (Habit habit : habits) {
                if (habit.getLongestStreak() != null) {
                    longestStreak = Math.max(longestStreak, habit.getLongestStreak());
                }
            }
        }
        List<Goal> goals = goalRepository.findByUserId(userId);
        double avgProgress = calculateAverageGoalProgress(goals);

        return UserProfileResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .age(user.getAge())
                .memberSince(user.getCreatedAt())
                .totalActivitiesLogged(totalActivities)
                .totalActiveHabits(activeHabits)
                .longestStreak(longestStreak)
                .averageGoalProgress(avgProgress)
                .build();
    }

    @Transactional
    @CacheEvict(key = "#email")
    public UserProfileResponseDTO updateProfile(String email, UserProfileUpdateDTO updateDTO) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }

        user.setFirstName(updateDTO.getFirstName().trim());
        user.setLastName(updateDTO.getLastName() != null ? updateDTO.getLastName().trim() : null);
        user.setAge(updateDTO.getAge());

        userRepository.save(user);

        return getUserProfile(email);
    }

    private double calculateAverageGoalProgress(List<Goal> goals) {
        if (goals == null || goals.isEmpty()) {
            return 0.0;
        }

        double totalPercentage = 0.0;
        int validGoals = 0;

        for (Goal goal : goals) {
            if (goal.getTargetValue() == null || goal.getTargetValue() <= 0) {
                continue;
            }

            double progress = goal.getTotalProgress() != null ? goal.getTotalProgress() : 0.0;
            double percentage = (progress / goal.getTargetValue()) * 100.0;

            totalPercentage += percentage;
            validGoals++;
        }

        if (validGoals == 0) {
            return 0.0;
        }

        return Math.round((totalPercentage / validGoals) * 100.0) / 100.0;
    }
}