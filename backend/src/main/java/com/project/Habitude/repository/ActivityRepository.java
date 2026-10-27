package com.project.Habitude.repository;

import com.project.Habitude.analytics.dto.ActivityReferenceAnalyticsDTO;
import com.project.Habitude.model.Activity;
import com.project.Habitude.model.Habit;
import com.project.Habitude.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    //    Optional<Activity> findByActivityId(Long activityId);
    //    Activity findByActivityId(Long activityId);

    List<Activity> findByUser(User user);

    List<Activity> findByUserId(Long id);
    Page<Activity> findByUserId(Long id, Pageable pageable);

    List<Activity> findByUserIdAndHabit(Long userId, Habit habit);

    List<Activity> findByUserIdAndHabitAndActivityDateTimeGreaterThanEqualAndActivityDateTimeLessThan(Long userId, Habit habit, Instant start, Instant end);


    @Query("""
    SELECT new com.project.Habitude.analytics.dto.ActivityReferenceAnalyticsDTO(
        u.age,
        a.referenceCategory,
        a.referenceUnit,
        SUM(a.value)
    )
    FROM Activity a
    JOIN a.user u
    WHERE a.user.id = :userId
      AND a.activityDateTime >= :start
      AND a.activityDateTime < :end
      AND a.referenceCategory IS NOT NULL
      AND a.referenceUnit IS NOT NULL
    GROUP BY u.age, a.referenceCategory, a.referenceUnit
""")
    List<ActivityReferenceAnalyticsDTO> getReferenceAnalytics(
            @Param("userId") Long userId,
            @Param("start") Instant start,
            @Param("end") Instant end
    );
//    Double sumTotalValueBetweenStartAndEndDate();


    long countByUserId(Long userId);

    @Query("""
        SELECT a.focus.name, COUNT(a)
        FROM Activity a
        WHERE a.user.id = :userId
        GROUP BY a.focus.name
        """)
    List<Object[]> countActivitiesByFocus(
            @Param("userId") Long userId
    );

    @Query("""
        SELECT a.referenceCategory, COUNT(a)
        FROM Activity a
        WHERE a.user.id = :userId
        GROUP BY a.referenceCategory
        """)
    List<Object[]> countActivitiesByReferenceCategory(
            @Param("userId") Long userId
    );

    @Query("""
        SELECT a.customUnit, SUM(a.value)
        FROM Activity a
        WHERE a.user.id = :userId
        AND a.customUnit IS NOT NULL
        AND a.value IS NOT NULL
        GROUP BY a.customUnit
        """)
    List<Object[]> sumValueByCustomUnit(
            @Param("userId") Long userId
    );

//    List<Activity> findByUserIdAndFocusIdAndDateRange(Long id, Long focusId, LocalDateTime start, LocalDateTime end);

    List<Activity> findByUserIdAndFocusIdAndActivityDateTimeGreaterThanEqualAndActivityDateTimeLessThan(
            Long userId,
            Long focusId,
            Instant start,
            Instant end
    );

    Optional<Activity> findByIdAndUserId(Long id, Long id1);

    List<Activity> findByUserIdOrderByActivityDateTimeDesc(Long id);
}
