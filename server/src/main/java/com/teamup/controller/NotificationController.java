package com.teamup.controller;

import com.teamup.entity.Notification;
import com.teamup.entity.User;
import com.teamup.repository.NotificationRepository;
import com.teamup.repository.UserRepository;
import com.teamup.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public NotificationController(NotificationRepository notificationRepository, UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping
    public ResponseEntity<?> getNotifications(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        User currentUser = getCurrentUser(authHeader);
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        long unreadCount = notifications.stream().filter(n -> !n.getIsRead()).count();

        return ResponseEntity.ok(Map.of("notifications", notifications, "unreadCount", unreadCount));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        Optional<Notification> notifOpt = notificationRepository.findById(id);
        if (notifOpt.isPresent()) {
            Notification n = notifOpt.get();
            n.setIsRead(true);
            notificationRepository.save(n);
            return ResponseEntity.ok(Map.of("notification", n));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        User currentUser = getCurrentUser(authHeader);
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        for (Notification n : notifications) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(notifications);
        return ResponseEntity.ok(Map.of("message", "All marked as read"));
    }

    private User getCurrentUser(String authHeader) {
        String userId = "user-anshk";
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            userId = token.startsWith("user-") ? token : jwtTokenProvider.getUserIdFromToken(token);
        }
        return userRepository.findById(userId).orElseGet(() -> userRepository.findById("user-anshk").orElseThrow());
    }
}
