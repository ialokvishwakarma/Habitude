package com.project.Habitude.repository;

import com.project.Habitude.model.Habit;
import com.project.Habitude.model.HabitStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {

    List<Habit> findByUserId(Long userId);

    List<Habit> findByUserIdAndFocusId(Long userId, Long id);

    List<Habit> findByUserIdAndFocusIdAndCustomUnit(
            Long userId,
            Long id,
            String customUnit
    );

    long countByUserId(Long userId);

    long countByUserIdAndStatus(
            Long userId,
            HabitStatus status
    );

    @Query("""
            SELECT h.habitType, COUNT(h)
            FROM Habit h
            WHERE h.user.id = :userId
            GROUP BY h.habitType
            """)
    List<Object[]> countHabitsByType(
            @Param("userId") Long userId
    );

    @Query("""
            SELECT h.focus.name, COUNT(h)
            FROM Habit h
            WHERE h.user.id = :userId
            GROUP BY h.focus.name
            """)
    List<Object[]> countHabitsByFocus(
            @Param("userId") Long userId
    );

//    List<Habit> findByUserIdAndFocusIdAndDateRange(Long id, Long focusId, LocalDateTime start, LocalDateTime end);
}