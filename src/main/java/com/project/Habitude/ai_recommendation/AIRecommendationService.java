package com.project.Habitude.ai_recommendation;

import com.project.Habitude.model.Activity;
import com.project.Habitude.model.ReferenceUnit;
import com.project.Habitude.model.User;
import com.project.Habitude.repository.ActivityRepository;
import com.project.Habitude.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AIRecommendationService {

    private final ChatClient chatClient;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    @Cacheable(
            value = "aiRecommendations",
            key = "#email + '::' + #focusId + '_' + #startDate + '_' + #endDate"
    )
    public String generateActivityRecommendation(
            String email,
            Long focusId,
            LocalDate startDate,
            LocalDate endDate) {

        User user = getUser(email);

        Instant start = startDate
                .atStartOfDay(ZoneId.systemDefault())
                .toInstant();

        Instant end = endDate
                .plusDays(1)
                .atStartOfDay(ZoneId.systemDefault())
                .toInstant();

        List<Activity> activities = getActivities(
                user.getId(),
                focusId,
                start,
                end
        );

        ActivityContextDTO context = buildActivityContext(activities);

        String prompt = buildPrompt(context);

        return getAIResponse(prompt);
    }

    private User getUser(String email) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return user;
    }

    private List<Activity> getActivities(
            Long userId,
            Long focusId,
            Instant start,
            Instant end) {

        return activityRepository
                .findByUserIdAndFocusIdAndActivityDateTimeGreaterThanEqualAndActivityDateTimeLessThan(
                        userId,
                        focusId,
                        start,
                        end
                );
    }

    private ActivityContextDTO buildActivityContext(List<Activity> activities) {

        String focus = getFocus(activities);

        long totalActivities = activities.size();

        double totalHours = activities.stream()
                .filter(activity -> activity.getReferenceUnit() == ReferenceUnit.HOURS)
                .mapToDouble(Activity::getValue)
                .sum();

        double totalMinutes = activities.stream()
                .filter(activity -> activity.getReferenceUnit() == ReferenceUnit.MINUTES)
                .mapToDouble(Activity::getValue)
                .sum();

        long activeDays = activities.stream()
                .map(activity -> activity.getActivityDateTime()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate())
                .distinct()
                .count();

        return ActivityContextDTO.builder()
                .focus(focus)
                .totalActivities(totalActivities)
                .totalHours(totalHours)
                .totalMinutes(totalMinutes)
                .activeDays(activeDays)
                .build();
    }

    private String getFocus(List<Activity> activities) {

        return activities.isEmpty()
                ? "No activities found"
                : activities.get(0).getFocus().getName();
    }

    private String buildPrompt(ActivityContextDTO context) {

        return """
                You are a friendly personal mentor helping someone improve in their focus area: %s.

                User Activity Data:
                - Focus Area: %s
                - Completed Sessions: %d
                - Total Time Spent: %.2f Hours (%.2f Minutes)
                - Active Days: %d

                RULES FOR LANGUAGE AND TONE:
                1. Use simple, everyday English that anyone can read and understand quickly.
                2. Avoid complex or academic words (do NOT use words like "inertia", "cognitive", "bottleneck", "activation energy", "deliberate practice", or "sprint").
                3. Keep sentences short and clear.
                4. DO NOT mention software terms like "app", "logged", "tracking", "timer", "entry", "system", or "record". Talk only about learning and real habits.
                5. Do not write greetings (e.g., "Hello") or closing signatures.

                Output format:
                ### 1. Overall Insight
                [1-2 very simple sentences explaining where they stand and encouraging them]

                ### 2. What Is Going Well
                - [One simple positive point about choosing this goal]
                - [One encouraging observation]

                ### 3. What Could Be Improved
                - [One simple challenge, e.g., making time every day or taking the first step]

                ### 4. Actionable Next Steps
                1. [One small, easy step they can do today in 10-15 minutes]
                2. [One simple tip for their daily routine or study area]
                """.formatted(
                context.getFocus(),
                context.getFocus(),
                context.getTotalActivities(),
                context.getTotalHours(),
                context.getTotalMinutes(),
                context.getActiveDays()
        );
    }

    private String getAIResponse(String prompt) {

        try {

            var response = chatClient
                    .prompt()
                    .user(prompt)
                    .call();

            return response.content();

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}