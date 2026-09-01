package com.teamup.controller;

import com.teamup.entity.Connection;
import com.teamup.entity.Notification;
import com.teamup.entity.User;
import com.teamup.repository.ConnectionRepository;
import com.teamup.repository.NotificationRepository;
import com.teamup.repository.UserRepository;
import com.teamup.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public ConnectionController(ConnectionRepository connectionRepository, UserRepository userRepository,
                                NotificationRepository notificationRepository, JwtTokenProvider jwtTokenProvider) {
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping
    public ResponseEntity<?> getConnections(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        User currentUser = getCurrentUser(authHeader);
        List<Connection> connections = connectionRepository.findAllForUser(currentUser.getId());

        List<Map<String, Object>> pendingRequests = new ArrayList<>();
        List<Map<String, Object>> sentRequests = new ArrayList<>();
        List<Map<String, Object>> acceptedConnections = new ArrayList<>();

        for (Connection c : connections) {
            if ("Pending".equals(c.getStatus())) {
                if (c.getReceiver().getId().equals(currentUser.getId())) {
                    pendingRequests.add(Map.of("id", c.getId(), "user", c.getSender(), "status", c.getStatus()));
                } else {
                    sentRequests.add(Map.of("id", c.getId(), "user", c.getReceiver(), "status", c.getStatus()));
                }
            } else if ("Accepted".equals(c.getStatus())) {
                User other = c.getSender().getId().equals(currentUser.getId()) ? c.getReceiver() : c.getSender();
                acceptedConnections.add(Map.of("id", c.getId(), "user", other, "status", c.getStatus()));
            }
        }

        return ResponseEntity.ok(Map.of(
            "pendingRequests", pendingRequests,
            "sentRequests", sentRequests,
            "acceptedConnections", acceptedConnections
        ));
    }

    @PostMapping("/request")
    public ResponseEntity<?> sendRequest(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, String> body) {

        User sender = getCurrentUser(authHeader);
        String receiverId = body.get("receiverId");

        Optional<User> receiverOpt = userRepository.findById(receiverId);
        if (receiverOpt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Receiver not found"));

        User receiver = receiverOpt.get();
        Optional<Connection> existing = connectionRepository.findBetweenUsers(sender.getId(), receiverId);
        if (existing.isPresent()) return ResponseEntity.ok(Map.of("connection", existing.get()));

        String connId = "conn-" + UUID.randomUUID().toString().substring(0, 8);
        Connection conn = new Connection(connId, sender, receiver, "Pending");
        connectionRepository.save(conn);

        // Create Notification
        Notification notif = new Notification(
            "notif-" + UUID.randomUUID().toString().substring(0, 8),
            receiverId,
            sender.getId(),
            "connection_request",
            "New Connection Request",
            sender.getName() + " (" + sender.getCollege() + ") wants to connect with you."
        );
        notificationRepository.save(notif);

        return ResponseEntity.ok(Map.of("connection", conn));
    }

    @PostMapping("/respond/{connectionId}")
    public ResponseEntity<?> respondToRequest(
            @PathVariable String connectionId,
            @RequestBody Map<String, String> body) {

        String action = body.get("action");
        Optional<Connection> connOpt = connectionRepository.findById(connectionId);
        if (connOpt.isEmpty()) return ResponseEntity.notFound().build();

        Connection conn = connOpt.get();
        conn.setStatus("Accept".equalsIgnoreCase(action) ? "Accepted" : "Declined");
        connectionRepository.save(conn);

        return ResponseEntity.ok(Map.of("connection", conn));
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
