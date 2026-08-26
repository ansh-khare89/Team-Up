package com.teamup.repository;

import com.teamup.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN u.skills s WHERE " +
           "LOWER(u.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(u.college) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(u.branch) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<User> searchUsers(@Param("q") String query);
}
