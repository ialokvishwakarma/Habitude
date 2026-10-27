package com.project.Habitude.repository;

import com.project.Habitude.model.Focus;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FocusRepository extends JpaRepository<Focus,Long> {
    List<Focus> findByUserId(Long userId);

    Focus findByName(String name);

    void deleteByName(String name);

    Focus findByNameAndUserId(String normalizedName, Long id);

    Optional<Focus> findByIdAndUserId(@NotNull(message = "Focus is required") Long focusId, Long id);
}
