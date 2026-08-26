package com.teamup.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "dsa_profiles")
public class DsaProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String platform; // LeetCode, Codeforces
    private String experienceLevel; // Beginner, Intermediate, Advanced
    private String preferredLanguage; // C++, Java, Python, Go
    private Integer dailyGoal; // 1, 2, 3, 4
    private String preferredTime;
    private Integer streakCount = 0;
    private String lastCheckIn;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    public DsaProfile() {}

    public DsaProfile(String platform, String experienceLevel, String preferredLanguage, Integer dailyGoal, String preferredTime, Integer streakCount, String lastCheckIn) {
        this.platform = platform;
        this.experienceLevel = experienceLevel;
        this.preferredLanguage = preferredLanguage;
        this.dailyGoal = dailyGoal;
        this.preferredTime = preferredTime;
        this.streakCount = streakCount;
        this.lastCheckIn = lastCheckIn;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public Integer getDailyGoal() { return dailyGoal; }
    public void setDailyGoal(Integer dailyGoal) { this.dailyGoal = dailyGoal; }

    public String getPreferredTime() { return preferredTime; }
    public void setPreferredTime(String preferredTime) { this.preferredTime = preferredTime; }

    public Integer getStreakCount() { return streakCount; }
    public void setStreakCount(Integer streakCount) { this.streakCount = streakCount; }

    public String getLastCheckIn() { return lastCheckIn; }
    public void setLastCheckIn(String lastCheckIn) { this.lastCheckIn = lastCheckIn; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
