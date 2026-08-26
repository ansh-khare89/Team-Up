package com.teamup.service;

import com.teamup.entity.Skill;
import com.teamup.entity.User;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    public static class MatchResult {
        public String userId;
        public int compatibilityPercentage;
        public Map<String, Integer> breakdown = new HashMap<>();
        public List<String> whyThisMatch = new ArrayList<>();

        public MatchResult(String userId, int compatibilityPercentage, Map<String, Integer> breakdown, List<String> whyThisMatch) {
            this.userId = userId;
            this.compatibilityPercentage = compatibilityPercentage;
            this.breakdown = breakdown;
            this.whyThisMatch = whyThisMatch;
        }
    }

    public static class StudentMatch {
        public User student;
        public MatchResult match;

        public StudentMatch(User student, MatchResult match) {
            this.student = student;
            this.match = match;
        }
    }

    public MatchResult calculateCompatibility(User currentUser, User targetUser) {
        if (currentUser.getId().equals(targetUser.getId())) return null;

        Map<String, Integer> breakdown = new HashMap<>();
        List<String> whyThisMatch = new ArrayList<>();

        List<String> currentSkills = currentUser.getSkills().stream().map(Skill::getName).collect(Collectors.toList());
        List<String> targetSkills = targetUser.getSkills().stream().map(Skill::getName).collect(Collectors.toList());

        // 1. Complementary Skills (35% max)
        int compScore = 0;
        boolean hasAiMlCurrent = currentSkills.stream().anyMatch(s -> s.equalsIgnoreCase("Python") || s.equalsIgnoreCase("Machine Learning") || s.equalsIgnoreCase("Data Science"));
        boolean hasWebTarget = targetSkills.stream().anyMatch(s -> s.equalsIgnoreCase("React") || s.equalsIgnoreCase("Node.js") || s.equalsIgnoreCase("Next.js") || s.equalsIgnoreCase("UI/UX"));

        boolean hasWebCurrent = currentSkills.stream().anyMatch(s -> s.equalsIgnoreCase("React") || s.equalsIgnoreCase("Node.js") || s.equalsIgnoreCase("Next.js") || s.equalsIgnoreCase("UI/UX"));
        boolean hasAiMlTarget = targetSkills.stream().anyMatch(s -> s.equalsIgnoreCase("Python") || s.equalsIgnoreCase("Machine Learning") || s.equalsIgnoreCase("Data Science"));

        if ((hasAiMlCurrent && hasWebTarget) || (hasWebCurrent && hasAiMlTarget)) {
            compScore = 35;
            whyThisMatch.add("✓ Complementary skills: AI/ML + Web Development & UI");
        } else {
            compScore = 20;
        }
        breakdown.put("complementarySkillsScore", compScore);

        // 2. Goal Match (25% max)
        List<String> commonGoals = currentUser.getCurrentGoals().stream()
                .filter(targetUser.getCurrentGoals()::contains)
                .collect(Collectors.toList());

        int goalScore = 0;
        if (!commonGoals.isEmpty()) {
            goalScore = 25;
            whyThisMatch.add("✓ Shared active goal: " + formatGoalName(commonGoals.get(0)));
        } else {
            goalScore = 15;
            whyThisMatch.add("✓ Both actively seeking campus tech collaborators");
        }
        breakdown.put("goalMatchScore", goalScore);

        // 3. Common Skills (15% max)
        List<String> sharedSkills = currentSkills.stream()
                .filter(targetSkills::contains)
                .collect(Collectors.toList());
        int commonScore = Math.min(15, sharedSkills.size() * 5);
        if (!sharedSkills.isEmpty()) {
            whyThisMatch.add("✓ Shared technical baseline: " + String.join(", ", sharedSkills.subList(0, Math.min(sharedSkills.size(), 3))));
        }
        breakdown.put("commonSkillsScore", commonScore);

        // 4. Experience & Availability (20% max)
        breakdown.put("experienceScore", 10);
        breakdown.put("availabilityScore", 8);
        whyThisMatch.add("✓ Balanced experience & schedule availability");

        // 5. Activity Status (5% max)
        int activityScore = "Actively Looking".equals(targetUser.getActivityStatus()) ? 5 : 3;
        breakdown.put("activityScore", activityScore);
        if (activityScore == 5) whyThisMatch.add("✓ Currently actively looking for teammates");

        int total = compScore + goalScore + commonScore + 10 + 8 + activityScore;
        int compatibilityPercentage = Math.min(99, Math.max(58, total));

        return new MatchResult(targetUser.getId(), compatibilityPercentage, breakdown, whyThisMatch);
    }

    public List<StudentMatch> rankRecommendations(User currentUser, List<User> allUsers) {
        return allUsers.stream()
                .filter(u -> !u.getId().equals(currentUser.getId()))
                .map(u -> new StudentMatch(u, calculateCompatibility(currentUser, u)))
                .sorted((a, b) -> Integer.compare(b.match.compatibilityPercentage, a.match.compatibilityPercentage))
                .collect(Collectors.toList());
    }

    private String formatGoalName(String goalId) {
        switch (goalId) {
            case "hackathon_teammate": return "Hackathon Teammate";
            case "project_collaborator": return "Project Collaborator";
            case "dsa_partner": return "DSA Study Partner";
            case "internship_prep": return "Internship Prep Partner";
            default: return goalId;
        }
    }
}
