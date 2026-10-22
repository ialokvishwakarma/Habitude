package com.project.Habitude.service;

import com.project.Habitude.config.CacheEvictionService;
import com.project.Habitude.dto.ActivityRequest;
import com.project.Habitude.dto.ActivityResponse;
import com.project.Habitude.dto.ActivityUpdateRequestDTO;
import com.project.Habitude.exceptions.AccessDeniedExceptionUser;
import com.project.Habitude.exceptions.ActivityNotFoundException;
import com.project.Habitude.model.*;
import com.project.Habitude.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@CacheConfig(cacheNames = "activities")
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final GoalRepository goalRepository;
    private final HabitRepository habitRepository;
    private final FocusRepository focusRepository;
    private final CacheEvictionService cacheEvictionService;

    @Transactional
    @Caching(evict = {
            @CacheEvict(cacheNames = "activities", key = "#authentication.name"),
            @CacheEvict(cacheNames = "goals", key = "#authentication.name"),
            @CacheEvict(cacheNames = "habits", key = "#authentication.name")
    })
    public ActivityResponse add(ActivityRequest activityRequest, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        if (activityRequest.getFocusId() == null) {
            throw new IllegalArgumentException("Focus ID must not be null");
        }

        Focus focus = focusRepository.findById(activityRequest.getFocusId())
                .orElseThrow(() -> new RuntimeException("Focus not found with id: " + activityRequest.getFocusId()));

        Activity activity = new Activity();
        activity.setTitle(activityRequest.getTitle());
        activity.setDescription(activityRequest.getDescription());
        activity.setValue(activityRequest.getValue() != null ? activityRequest.getValue() : 0.0);
        activity.setCustomUnit(activityRequest.getCustomUnit());

        Instant actTime = activityRequest.getActivityDateTime() != null
                ? activityRequest.getActivityDateTime()
                : Instant.now();
        activity.setActivityDateTime(actTime);
        activity.setUser(user);
        activity.setFocus(focus);

        if (activityRequest.getHabitId() != null) {
            Habit habit = habitRepository.findById(activityRequest.getHabitId()).orElse(null);
            activity.setHabit(habit);
        }

        Activity saved = activityRepository.save(activity);

        try {
            updateGoalProgress(user.getId(), focus, saved.getCustomUnit(), saved.getActivityDateTime(), saved.getValue());
            updateHabitProgress(user.getId(), focus, saved.getCustomUnit(), saved.getActivityDateTime(), saved.getValue());
        } catch (Exception e) {
            log.error("Failed to propagate progress to goals/habits: {}", e.getMessage(), e);
        }

        ActivityResponse response = modelMapper.map(saved, ActivityResponse.class);
        response.setFocusName(focus.getName());
        if (saved.getHabit() != null) {
            response.setHabitTitle(saved.getHabit().getTitle());
        }

        cacheEvictionService.evictUserAiRecommendations(authentication.getName());
        return response;
    }

    @Cacheable(key = "#authentication.name")
    public List<ActivityResponse> findByUser(Authentication authentication) {
        log.info("CACHE MISS - Fetching activities from Database for user: {}", authentication.getName());
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        List<Activity> activities = activityRepository.findByUserIdOrderByActivityDateTimeDesc(user.getId());
        if (activities.isEmpty()) {
            throw new ActivityNotFoundException("Activity not found for user: ", user.getId());
        }

        return activities.stream()
                .map(activity -> {
                    ActivityResponse response = modelMapper.map(activity, ActivityResponse.class);
                    if (activity.getFocus() != null) {
                        response.setFocusName(activity.getFocus().getName());
                    }
                    if (activity.getHabit() != null) {
                        response.setHabitTitle(activity.getHabit().getTitle());
                    }
                    return response;
                })
                .toList();
    }

    @Transactional
    @CacheEvict(cacheNames = "activities", key = "#authentication.name")
    public void deleteActivityById(Long id, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        Activity activity = activityRepository.findById(id).orElseThrow(
                () -> new ActivityNotFoundException("Activity not found with Id : ", id)
        );
        if (!activity.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedExceptionUser("Access Denied");
        }
        log.info("Activity deleted with id: {}", id);
        activityRepository.deleteById(id);
    }

    @Transactional
    @CacheEvict(cacheNames = "activities", key = "#authentication.name")
    public ActivityResponse updateActivity(Long id, ActivityUpdateRequestDTO updateRequestDTO, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        Activity activity = activityRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + id));

        Focus focus = focusRepository.findByIdAndUserId(updateRequestDTO.getFocusId(), user.getId())
                .orElseThrow(() -> new RuntimeException("Focus area not found with id: " + updateRequestDTO.getFocusId()));

        activity.setTitle(updateRequestDTO.getTitle());
        activity.setDescription(updateRequestDTO.getDescription());
        activity.setValue(updateRequestDTO.getValue());
        activity.setFocus(focus);

        Activity updated = activityRepository.save(activity);

        ActivityResponse response = modelMapper.map(updated, ActivityResponse.class);
        response.setFocusName(focus.getName());
        return response;
    }

    public void updateGoalProgress(Long userId, Focus focus, String customUnit, Instant activityDateTime, Double value) {
        if (value == null || value <= 0) return;

        List<Goal> goals = goalRepository.findByUserIdAndFocusId(userId, focus.getId());
        if (goals.isEmpty()) return;

        LocalDate activityDate = activityDateTime != null
                ? activityDateTime.atZone(ZoneOffset.UTC).toLocalDate()
                : LocalDate.now();

        for (Goal goal : goals) {
            boolean unitMatches = (goal.getCustomUnit() == null && customUnit == null) ||
                    (goal.getCustomUnit() != null && goal.getCustomUnit().equalsIgnoreCase(customUnit));

            if (!unitMatches) continue;

            boolean withinStart = goal.getStartDate() == null || !activityDate.isBefore(goal.getStartDate());
            boolean withinEnd = goal.getEndDate() == null || !activityDate.isAfter(goal.getEndDate());

            if (withinStart && withinEnd) {
                double current = goal.getTotalProgress() != null ? goal.getTotalProgress() : 0.0;
                double newProgress = current + value;
                 goal.setTotalProgress(newProgress);

                 double target = goal.getTargetValue() != null ? goal.getTargetValue() : 0.0;
                if (target > 0 && newProgress >= target) {
                    goal.setStatus(GoalStatus.DONE);
                } else {
                     goal.setStatus(GoalStatus.IN_PROGRESS);
                }
            }
        }

        goalRepository.saveAll(goals);
    }

    public void updateHabitProgress(
            Long userId,
            Focus focus,
            String customUnit,
            Instant activityDateTime,
            Double value) {

        if (activityDateTime == null) return;

        List<Habit> habits = habitRepository.findByUserIdAndFocusIdAndCustomUnit(
                userId, focus.getId(), customUnit);

        for (Habit habit : habits) {
            if (habit.getFrequency() == null) continue;
            LocalDate activityDate = activityDateTime.atZone(ZoneOffset.UTC).toLocalDate();
             LocalDate startDate;
             LocalDate endDate;
            LocalDate prevStartDate;
             LocalDate prevEndDate;

            switch (habit.getFrequency()) {
                case DAILY -> {
                    startDate = activityDate;
                     endDate = startDate.plusDays(1);
                    prevStartDate = startDate.minusDays(1);
                    prevEndDate = startDate;
                }
                case WEEKLY -> {
                    startDate = activityDate.with(DayOfWeek.MONDAY);
                    endDate = startDate.plusWeeks(1);
                     prevStartDate = startDate.minusWeeks(1);
                    prevEndDate = startDate;
                }
                case MONTHLY -> {
                     startDate = activityDate.withDayOfMonth(1);
                    endDate = startDate.plusMonths(1);
                    prevStartDate = startDate.minusMonths(1);
                    prevEndDate = startDate;
                }
                default -> { continue; }
            }

            Instant start = startDate.atStartOfDay(ZoneOffset.UTC).toInstant();
            Instant end = endDate.atStartOfDay(ZoneOffset.UTC).toInstant();
            Instant prevStart = prevStartDate.atStartOfDay(ZoneOffset.UTC).toInstant();
            Instant prevEnd = prevEndDate.atStartOfDay(ZoneOffset.UTC).toInstant();

            List<Activity> activities = activityRepository
                    .findByUserIdAndHabitAndActivityDateTimeGreaterThanEqualAndActivityDateTimeLessThan(
                            userId, habit, start, end);
            double totalValue = activities.stream()
                    .mapToDouble(a -> a.getValue() != null ? a.getValue() : 0.0)
                    .sum();

            double target = habit.getTargetValue() != null ? habit.getTargetValue() : 1.0;
            if (totalValue < target) {
                continue;
            }

            Instant lastCompletedAt = habit.getLastCompletedAt();

            boolean alreadyCompletedThisPeriod =
                    lastCompletedAt != null
                            && !lastCompletedAt.isBefore(start)
                            && lastCompletedAt.isBefore(end);

            if (alreadyCompletedThisPeriod) {
                continue;
            }

            boolean previousPeriodCompleted =
                    lastCompletedAt != null
                            && !lastCompletedAt.isBefore(prevStart)
                            && lastCompletedAt.isBefore(prevEnd);

            int currentStreak = habit.getCurrentStreak() == null ? 0 : habit.getCurrentStreak();
            currentStreak = previousPeriodCompleted ? currentStreak + 1 : 1;
            habit.setCurrentStreak(currentStreak);

            int longestStreak = habit.getLongestStreak() == null ? 0 : habit.getLongestStreak();
            habit.setLongestStreak(Math.max(longestStreak, currentStreak));

            habit.setLastCompletedAt(findCompletionTimestamp(activities, target));

            if (habit.getStatus() != HabitStatus.ACTIVE) {
                habit.setStatus(HabitStatus.ACTIVE);
            }

            habitRepository.save(habit);
        }
    }

    private Instant findCompletionTimestamp(List<Activity> activities, double targetValue) {
        List<Activity> sorted = activities.stream()
                .filter(a -> a.getActivityDateTime() != null)
                .sorted(Comparator.comparing(Activity::getActivityDateTime))
                .toList();

        double running = 0;
        for (Activity a : sorted) {
            running += (a.getValue() != null ? a.getValue() : 0.0);
            if (running >= targetValue) {
                return a.getActivityDateTime();
            }
        }
        return sorted.isEmpty() ? Instant.now() : sorted.get(sorted.size() - 1).getActivityDateTime();
    }
}