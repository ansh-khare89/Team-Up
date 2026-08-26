package com.teamup.controller;

import com.teamup.entity.Message;
import com.teamup.repository.MessageRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Controller
public class WebSocketChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository;

    public WebSocketChatController(SimpMessagingTemplate messagingTemplate, MessageRepository messageRepository) {
        this.messagingTemplate = messagingTemplate;
        this.messageRepository = messageRepository;
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload Map<String, String> payload) {
        String senderId = payload.get("senderId");
        String receiverId = payload.get("receiverId");
        String content = payload.get("content");

        String msgId = "msg-" + UUID.randomUUID().toString().substring(0, 8);
        Message message = new Message(msgId, senderId, receiverId, content);
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);

        // Send to topic for recipient
        messagingTemplate.convertAndSend("/topic/messages/" + receiverId, message);
        messagingTemplate.convertAndSend("/topic/messages/" + senderId, message);
    }
}
