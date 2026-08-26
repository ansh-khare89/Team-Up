package com.teamup.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    private String id;

    private String userId;
    private String senderId;
    private String type; // connection_request, connection_accepted, match_alert, opportunity_interest
    private String title;
    private String message;
    private Boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Notification() {}

    public Notification(String id, String userId, String senderId, String type, String title, String message) {
        this.id = id;
        this.userId = userId;
        this.senderId = senderId;
        this.type = type;
        this.title = title;
        this.message = message;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
