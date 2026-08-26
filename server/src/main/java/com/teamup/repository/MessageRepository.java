package com.teamup.repository;

import com.teamup.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, String> {
    @Query("SELECT m FROM Message m WHERE " +
           "(m.senderId = :userA AND m.receiverId = :userB) OR " +
           "(m.senderId = :userB AND m.receiverId = :userA) " +
           "ORDER BY m.timestamp ASC")
    List<Message> findMessagesBetween(@Param("userA") String userA, @Param("userB") String userB);
}
