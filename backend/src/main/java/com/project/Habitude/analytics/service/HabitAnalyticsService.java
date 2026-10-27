package com.project.Habitude.analytics.service;

import com.project.Habitude.analytics.dto.HabitAnalyticsResponseDTO;
import com.project.Habitude.model.Habit;
import com.project.Habitude.model.HabitStatus;
import com.project.Habitude.repository.HabitRepository;
import com.project.Habitude.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HabitAnalyticsService {

    private final HabitRepository habitRepository;
    private final UserRepository userRepository;

    public HabitAnalyticsResponseDTO getHabitAnalytics(String email) {

        var user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Long userId = user.getId();

        long totalHabits =
                habitRepository.countByUserId(userId);

        long activeHabits =
                habitRepository.countByUserIdAndStatus(
                        userId,
                        HabitStatus.ACTIVE
                );

        long completedHabits =
                habitRepository.countByUserIdAndStatus(
                        userId,
                        HabitStatus.COMPLETED
                );

        long pausedHabits =
                habitRepository.countByUserIdAndStatus(
                        userId,
                        HabitStatus.PAUSED
                );

        List<Habit> habits =
                habitRepository.findByUserId(userId);

        double averageCurrentStreak =
                calculateAverageCurrentStreak(habits);

        long longestStreak =
                calculateLongestStreak(habits);

        Map<String, Long> habitsByType =
                getHabitsByType(userId);

        Map<String, Long> habitsByFocus =
                getHabitsByFocus(userId);

        return new HabitAnalyticsResponseDTO(
                totalHabits,
                activeHabits,
                completedHabits,
                pausedHabits,
                averageCurrentStreak,
                longestStreak,
                habitsByType,
                habitsByFocus
        );
    }

    private double calculateAverageCurrentStreak(
            List<Habit> habits) {

        if (habits.isEmpty()) {
            return 0.0;
        }

        int totalStreak = 0;
        int validHabits = 0;

        for (Habit habit : habits) {

            if (habit.getCurrentStreak() == null) {
                continue;
            }

            totalStreak += habit.getCurrentStreak();
            validHabits++;
        }

        if (validHabits == 0) {
            return 0.0;
        }

        return Math.round(
                ((double) totalStreak / validHabits) * 100.0
        ) / 100.0;
    }

    private long calculateLongestStreak(
            List<Habit> habits) {

        long longestStreak = 0;

        for (Habit habit : habits) {

            if (habit.getLongestStreak() == null) {
                continue;
            }

            longestStreak = Math.max(
                    longestStreak,
                    habit.getLongestStreak()
            );
        }

        return longestStreak;
    }

    private Map<String, Long> getHabitsByType(Long userId) {
        List<Object[]> results = habitRepository.countHabitsByType(userId);
        Map<String, Long> habitsByType = new LinkedHashMap<>();

        if (results != null) {
            for (Object[] result : results) {
                if (result != null && result.length >= 2 && result[0] != null) {
                    String type = result[0].toString();
                    Long count = result[1] != null ? ((Number) result[1]).longValue() : 0L;
                    habitsByType.put(type, count);
                }
            }
        }
        return habitsByType;
    }

    private Map<String, Long> getHabitsByFocus(Long userId) {
        List<Object[]> results = habitRepository.countHabitsByFocus(userId);
        Map<String, Long> habitsByFocus = new LinkedHashMap<>();

        if (results != null) {
            for (Object[] result : results) {
                if (result != null && result.length >= 2) {
                    String focusName = result[0] != null ? result[0].toString() : "GENERAL";
                    Long count = result[1] != null ? ((Number) result[1]).longValue() : 0L;
                    habitsByFocus.put(focusName, count);
                }
            }
        }
        return habitsByFocus;
    }
}