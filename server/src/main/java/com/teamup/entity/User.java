package com.teamup.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String profilePicture;
    private String college;
    private String branch;
    private String yearOfStudy;

    @Column(length = 1000)
    private String bio;

    private String activityStatus; // 'Actively Looking', 'Open to Opportunities', 'Not Looking Right Now'
    private String github;
    private String linkedin;
    private String leetcode;
    private String portfolio;

    private Boolean onboarded = false;
    private LocalDateTime lastActive = LocalDateTime.now();

    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Skill> skills = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_goals", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "goal")
    private List<String> currentGoals = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_availability_days", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "available_day")
    private List<String> availabilityDays = new ArrayList<>();

    private String availabilityTime;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private DsaProfile dsaProfile;

    public User() {}

    public User(String id, String name, String email, String password, String college, String branch, String yearOfStudy) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.college = college;
        this.branch = branch;
        this.yearOfStudy = yearOfStudy;
        this.activityStatus = "Actively Looking";
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(String yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getActivityStatus() { return activityStatus; }
    public void setActivityStatus(String activityStatus) { this.activityStatus = activityStatus; }

    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }

    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

    public String getLeetcode() { return leetcode; }
    public void setLeetcode(String leetcode) { this.leetcode = leetcode; }

    public String getPortfolio() { return portfolio; }
    public void setPortfolio(String portfolio) { this.portfolio = portfolio; }

    public Boolean getOnboarded() { return onboarded; }
    public void setOnboarded(Boolean onboarded) { this.onboarded = onboarded; }

    public LocalDateTime getLastActive() { return lastActive; }
    public void setLastActive(LocalDateTime lastActive) { this.lastActive = lastActive; }

    public List<Skill> getSkills() { return skills; }
    public void setSkills(List<Skill> skills) { this.skills = skills; }

    public List<String> getCurrentGoals() { return currentGoals; }
    public void setCurrentGoals(List<String> currentGoals) { this.currentGoals = currentGoals; }

    public List<String> getAvailabilityDays() { return availabilityDays; }
    public void setAvailabilityDays(List<String> availabilityDays) { this.availabilityDays = availabilityDays; }

    public String getAvailabilityTime() { return availabilityTime; }
    public void setAvailabilityTime(String availabilityTime) { this.availabilityTime = availabilityTime; }

    public DsaProfile getDsaProfile() { return dsaProfile; }
    public void setDsaProfile(DsaProfile dsaProfile) { 
        this.dsaProfile = dsaProfile; 
        if (dsaProfile != null) dsaProfile.setUser(this);
    }
}
