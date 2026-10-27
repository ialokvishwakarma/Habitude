package com.project.Habitude.repository;

import com.project.Habitude.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

//    Optional<User> fingByProviderIdAndProviderType(String providerId, AuthProviderType providerType);
}
