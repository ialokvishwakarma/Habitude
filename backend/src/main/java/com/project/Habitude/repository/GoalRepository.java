package com.project.Habitude.repository;

import com.project.Habitude.model.Goal;
import com.project.Habitude.model.GoalStatus;
import jakarta.validation.Valid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByUserId(@Valid Long id);

    List<Goal> findByUserIdAndFocusId(Long userId,Long focusId);

    long countByUserId(Long userId);

    long countByUserIdAndIsActiveTrue(Long userId);

    long countByUserIdAndStatus(Long userId, GoalStatus status);


    @Query("""
            SELECT g.focus.name, COUNT(g)
            FROM Goal g
            WHERE g.user.id = :userId
            GROUP BY g.focus.name
            """)
    List<Object[]> countGoalsByFocus(@Param("userId") Long userId);

//    List<Goal> findByUserIdAndFocusIdAndDateRange(Long id, Long focusId, LocalDateTime start, LocalDateTime end);

//    List<Goal> findByUserIdAndActivityCategoryAndCustomUnit(Long id, ActivityCategory activityCategory,String customUnit);
}
