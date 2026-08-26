package com.teamup.repository;

import com.teamup.entity.Connection;
import com.teamup.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, String> {
    @Query("SELECT c FROM Connection c WHERE c.sender.id = :userId OR c.receiver.id = :userId")
    List<Connection> findAllForUser(@Param("userId") String userId);

    @Query("SELECT c FROM Connection c WHERE " +
           "(c.sender.id = :userA AND c.receiver.id = :userB) OR " +
           "(c.sender.id = :userB AND c.receiver.id = :userA)")
    Optional<Connection> findBetweenUsers(@Param("userA") String userA, @Param("userB") String userB);
}
