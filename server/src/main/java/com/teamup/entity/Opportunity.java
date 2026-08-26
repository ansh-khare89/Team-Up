package com.teamup.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "opportunities")
public class Opportunity {

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "creator_id")
    private User creator;

    private String title;

    @Column(length = 2000)
    private String description;

    private String category; // Project, Hackathon, Open Source, DSA Study Group, Interview Preparation

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "opportunity_skills", joinColumns = @JoinColumn(name = "opportunity_id"))
    @Column(name = "skill")
    private List<String> requiredSkills = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "opportunity_roles", joinColumns = @JoinColumn(name = "opportunity_id"))
    @Column(name = "role")
    private List<String> requiredRoles = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "opportunity_interests",
        joinColumns = @JoinColumn(name = "opportunity_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> interestedUsers = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    public Opportunity() {}

    public Opportunity(String id, User creator, String title, String description, String category) {
        this.id = id;
        this.creator = creator;
        this.title = title;
        this.description = description;
        this.category = category;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getCreator() { return creator; }
    public void setCreator(User creator) { this.creator = creator; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<String> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; }

    public List<String> getRequiredRoles() { return requiredRoles; }
    public void setRequiredRoles(List<String> requiredRoles) { this.requiredRoles = requiredRoles; }

    public List<User> getInterestedUsers() { return interestedUsers; }
    public void setInterestedUsers(List<User> interestedUsers) { this.interestedUsers = interestedUsers; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
