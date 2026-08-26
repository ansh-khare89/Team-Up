package com.teamup.controller;

import com.teamup.entity.Connection;
import com.teamup.entity.Message;
import com.teamup.entity.User;
import com.teamup.repository.ConnectionRepository;
import com.teamup.repository.MessageRepository;
import com.teamup.repository.UserRepository;
import com.teamup.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final MessageRepository messageRepository;
    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public ChatController(MessageRepository messageRepository, ConnectionRepository connectionRepository,
                          UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
        this.messageRepository = messageRepository;
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping("/conversations")
    public ResponseEntity<?> getConversations(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        User currentUser = getCurrentUser(authHeader);
        List<Connection> connections = connectionRepository.findAllForUser(currentUser.getId());

        List<Map<String, Object>> conversations = new ArrayList<>();
        for (Connection c : connections) {
            if ("Accepted".equals(c.getStatus())) {
                User other = c.getSender().getId().equals(currentUser.getId()) ? c.getReceiver() : c.getSender();
                List<Message> msgs = messageRepository.findMessagesBetween(currentUser.getId(), other.getId());
                Message lastMsg = msgs.isEmpty() ? null : msgs.get(msgs.size() - 1);

                Map<String, Object> map = new HashMap<>();
                map.put("connectionId", c.getId());
                map.put("user", other);
                map.put("lastMessage", lastMsg);
                map.put("unreadCount", 0);
                conversations.add(map);
            }
        }

        return ResponseEntity.ok(Map.of("conversations", conversations));
    }

    @GetMapping("/messages/{receiverId}")
    public ResponseEntity<?> getMessages(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable String receiverId) {

        User currentUser = getCurrentUser(authHeader);
        List<Message> messages = messageRepository.findMessagesBetween(currentUser.getId(), receiverId);
        Optional<User> otherUser = userRepository.findById(receiverId);

        return ResponseEntity.ok(Map.of("messages", messages, "user", otherUser.orElse(null)));
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, String> body) {

        User sender = getCurrentUser(authHeader);
        String receiverId = body.get("receiverId");
        String content = body.get("content");

        String msgId = "msg-" + UUID.randomUUID().toString().substring(0, 8);
        Message msg = new Message(msgId, sender.getId(), receiverId, content);
        msg.setTimestamp(LocalDateTime.now());

        messageRepository.save(msg);
        return ResponseEntity.ok(Map.of("message", msg));
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
