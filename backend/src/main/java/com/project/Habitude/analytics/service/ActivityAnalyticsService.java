package com.project.Habitude.analytics.service;

import com.project.Habitude.analytics.dto.ActivityAnalyticsResponseDTO;
import com.project.Habitude.analytics.dto.ActivityReferenceAnalyticsDTO;
import com.project.Habitude.model.User;
import com.project.Habitude.repository.ActivityRepository;
import com.project.Habitude.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ActivityAnalyticsService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public List<ActivityReferenceAnalyticsDTO> getReferenceAnalytics(
            Long userId,
            Instant start,
            Instant end) {

        List<ActivityReferenceAnalyticsDTO> analytics =
                activityRepository.getReferenceAnalytics(userId, start, end);

        long days = ChronoUnit.DAYS.between(start, end);

        for (ActivityReferenceAnalyticsDTO dto : analytics) {
            double avgValue = dto.getTotalValue() / days;
//            dto.setAvgValue(avgValue);
        }

        return analytics;
    }

    public ActivityAnalyticsResponseDTO getActivityAnalytics(String email) {

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        Long userId = user.getId();

        long totalActivities = activityRepository.countByUserId(userId);

        List<Object[]> focusResults = activityRepository.countActivitiesByFocus(userId);
        Map<String, Long> activitiesByFocus = new LinkedHashMap<>();

        if (focusResults != null) {
            for (Object[] row : focusResults) {
                if (row != null && row.length >= 2) {
                    String focus = row[0] != null ? row[0].toString() : "GENERAL";
                    Long count = row[1] != null ? ((Number) row[1]).longValue() : 0L;
                    activitiesByFocus.put(focus, count);
                }
            }
        }


        List<Object[]> referenceResults = activityRepository.countActivitiesByReferenceCategory(userId);
        Map<String, Long> activitiesByReferenceCategory = new LinkedHashMap<>();

        if (referenceResults != null) {
            for (Object[] row : referenceResults) {
                if (row != null && row.length >= 2 && row[0] != null) {
                    String category = row[0].toString();
                    Long count = row[1] != null ? ((Number) row[1]).longValue() : 0L;
                    activitiesByReferenceCategory.put(category, count);
                  }
            }
        }

        List<Object[]> valueResults = activityRepository.sumValueByCustomUnit(userId);
        Map<String, Double> valueByUnit = new LinkedHashMap<>();

        if (valueResults != null) {
            for (Object[] row : valueResults) {
                if (row != null && row.length >= 2 && row[0] != null) {
                    String unit = row[0].toString();
                    Double value = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
                    valueByUnit.put(unit, value);
                }
            }
         }
        return new ActivityAnalyticsResponseDTO(
                totalActivities,
                activitiesByFocus,
                activitiesByReferenceCategory,
                valueByUnit
        );
    }
}