package com.project.Habitude.repository;

import com.project.Habitude.model.RefreshToken;
import com.project.Habitude.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken,Long> {
    Optional<RefreshToken> findById(Long id);

    Optional<RefreshToken> findByToken(String token);

    RefreshToken findByUserId(Long id);

    RefreshToken findByUser(User user);
}
