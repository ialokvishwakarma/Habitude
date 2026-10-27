package com.project.Habitude.analytics.service;

import com.project.Habitude.analytics.dto.ActivityReferenceAnalyticsDTO;
import com.project.Habitude.analytics.dto.RecommendationDTO;
import com.project.Habitude.analytics.repo.ActivityReferenceRepository;
import com.project.Habitude.model.ActivityReference;
import com.project.Habitude.model.ComparisonType;
import com.project.Habitude.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final ActivityAnalyticsService activityAnalyticsService;
    private final ActivityReferenceRepository activityReferenceRepository;

    public List<RecommendationDTO> getRecommendations(
            User user,
            LocalDate startDate,
            LocalDate endDate) {

        if (user == null || user.getAge() == null) {
            return new ArrayList<>(); // Age required for normative benchmark comparison
        }

        ZoneId zone = ZoneId.of("Asia/Kolkata");
        Instant start = startDate.atStartOfDay(zone).toInstant();
        Instant end = endDate.plusDays(1).atStartOfDay(zone).toInstant();

        long days = Math.max(1, ChronoUnit.DAYS.between(start, end));

        List<ActivityReferenceAnalyticsDTO> analytics =
                activityAnalyticsService.getReferenceAnalytics(
                        user.getId(),
                        start,
                        end
                );

        List<RecommendationDTO> recommendations = new ArrayList<>();
        if (analytics == null) {
            return recommendations;
        }

        for (ActivityReferenceAnalyticsDTO data : analytics) {
            if (data == null || data.getReferenceCategory() == null || data.getReferenceUnit() == null) {
                continue;
            }

            ActivityReference reference =
                    activityReferenceRepository.findReference(
                            data.getReferenceCategory(),
                            data.getReferenceUnit(),
                            data.getAge() != null ? data.getAge() : user.getAge()
                    ).orElse(null);

            if (reference == null || reference.getReferenceValue() == null) {
                continue;
            }

            double rawActual = (data.getTotalValue() != null ? data.getTotalValue() : 0.0) / days;
            double actualValue = Math.round(rawActual * 100.0) / 100.0;
            double referenceValue = reference.getReferenceValue().doubleValue();

            boolean meetsReference;
            if (reference.getComparisonType() == ComparisonType.MINIMUM) {
                meetsReference = actualValue >= referenceValue;
            } else {
                meetsReference = actualValue <= referenceValue;
            }

            String catName = data.getReferenceCategory().name().toLowerCase().replace('_', ' ');
            String unitName = data.getReferenceUnit().name().toLowerCase().replace('_', ' ');

            String message;
            if (meetsReference) {
                message = "Your average " + catName + " activity (" + actualValue + " " + unitName + "/day) meets the recommended level of " + referenceValue + " " + unitName + " per day.";
            } else if (reference.getComparisonType() == ComparisonType.MINIMUM) {
                message = "Your average " + catName + " activity (" + actualValue + " " + unitName + "/day) is below the recommended minimum of " + referenceValue + " " + unitName + " per day.";
            } else {
                message = "Your average " + catName + " activity (" + actualValue + " " + unitName + "/day) is above the recommended maximum of " + referenceValue + " " + unitName + " per day.";
            }

            recommendations.add(
                    new RecommendationDTO(
                            data.getReferenceCategory(),
                            data.getReferenceUnit(),
                            actualValue,
                            referenceValue,
                            reference.getComparisonType(),
                            message
                    )
            );
        }

        return recommendations;
    }
}