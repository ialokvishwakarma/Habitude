package com.project.Habitude.analytics.repo;

import com.project.Habitude.model.ActivityReference;
import com.project.Habitude.model.ReferenceCategory;
import com.project.Habitude.model.ReferenceUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActivityReferenceRepository
        extends JpaRepository<ActivityReference, Long> {

    @Query("""
        SELECT ar
        FROM ActivityReference ar
        WHERE ar.referenceCategory = :category
          AND ar.referenceUnit = :unit
          AND :age BETWEEN ar.minAge AND ar.maxAge
    """)
    Optional<ActivityReference> findReference(
            @Param("category") ReferenceCategory category,
            @Param("unit") ReferenceUnit unit,
            @Param("age") Integer age
    );
}