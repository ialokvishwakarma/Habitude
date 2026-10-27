package com.project.Habitude.analytics.service;

import com.project.Habitude.analytics.dto.GoalAnalyticsResponseDTO;
import com.project.Habitude.model.Goal;
import com.project.Habitude.model.GoalStatus;
import com.project.Habitude.model.User;
import com.project.Habitude.repository.GoalRepository;
import com.project.Habitude.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GoalAnalyticsService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalAnalyticsResponseDTO getGoalAnalytics(String email) {

        User user = userRepository.findByEmail(email);

        Long userId = user.getId();

        long totalGoals = goalRepository.countByUserId(userId);

        long activeGoals =
                goalRepository.countByUserIdAndIsActiveTrue(userId);

        long completedGoals =
                goalRepository.countByUserIdAndStatus(
                        userId, GoalStatus.DONE);

        long notStartedGoals =
                goalRepository.countByUserIdAndStatus(
                        userId, GoalStatus.NOT_STARTED);

        List<Goal> goals =
                goalRepository.findByUserId(userId);

        double averageProgress =
                calculateAverageProgress(goals);

        Map<String, Long> goalsByFocus =
                getGoalsByFocus(userId);

        return new GoalAnalyticsResponseDTO(
                totalGoals,
                activeGoals,
                completedGoals,
                notStartedGoals,
                averageProgress,
                goalsByFocus
        );
    }

    private double calculateAverageProgress(List<Goal> goals) {

        if (goals.isEmpty()) {
            return 0.0;
        }

        double totalPercentage = 0.0;
        int validGoals = 0;

        for (Goal goal : goals) {

            if (goal.getTargetValue() == null ||
                    goal.getTargetValue() <= 0) {
                continue;
            }

            double progress = goal.getTotalProgress() == null
                    ? 0.0
                    : goal.getTotalProgress();

            double percentage =
                    (progress / goal.getTargetValue()) * 100;

            totalPercentage += percentage;
            validGoals++;
        }

        if (validGoals == 0) {
            return 0.0;
        }

        return Math.round(
                (totalPercentage / validGoals) * 100.0
        ) / 100.0;
    }

    private Map<String, Long> getGoalsByFocus(Long userId) {
        List<Object[]> results = goalRepository.countGoalsByFocus(userId);
        Map<String, Long> goalsByFocus = new LinkedHashMap<>();

        if (results != null) {
            for (Object[] result : results) {
                if (result != null && result.length >= 2) {
                    String focusName = result[0] != null ? result[0].toString() : "GENERAL";
                    Long count = result[1] != null ? ((Number) result[1]).longValue() : 0L;
                    goalsByFocus.put(focusName, count);
                }
            }
        }
        return goalsByFocus;
    }
}