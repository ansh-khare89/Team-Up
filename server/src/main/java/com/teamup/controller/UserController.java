package com.teamup.controller;

import com.teamup.entity.User;
import com.teamup.repository.UserRepository;
import com.teamup.security.JwtTokenProvider;
import com.teamup.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final RecommendationService recommendationService;
    private final JwtTokenProvider jwtTokenProvider;

    public UserController(UserRepository userRepository, RecommendationService recommendationService, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.recommendationService = recommendationService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        User currentUser = getCurrentUser(authHeader);
        List<User> allUsers = userRepository.findAll();

        List<RecommendationService.StudentMatch> recommendations = recommendationService.rankRecommendations(currentUser, allUsers);
        return ResponseEntity.ok(Map.of("recommendations", recommendations));
    }

    @GetMapping("/explore")
    public ResponseEntity<?> exploreStudents(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String college,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String activityStatus) {

        User currentUser = getCurrentUser(authHeader);
        List<User> students = userRepository.findAll();

        students.removeIf(u -> u.getId().equals(currentUser.getId()));

        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            students.removeIf(s -> !s.getName().toLowerCase().contains(q) &&
                                   !s.getCollege().toLowerCase().contains(q) &&
                                   !s.getBranch().toLowerCase().contains(q));
        }

        if (college != null && !college.isBlank()) {
            students.removeIf(s -> !s.getCollege().toLowerCase().contains(college.toLowerCase()));
        }

        if (year != null && !year.isBlank()) {
            students.removeIf(s -> !s.getYearOfStudy().equals(year));
        }

        if (activityStatus != null && !activityStatus.isBlank()) {
            students.removeIf(s -> !s.getActivityStatus().equals(activityStatus));
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (User s : students) {
            RecommendationService.MatchResult match = recommendationService.calculateCompatibility(currentUser, s);
            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            map.put("name", s.getName());
            map.put("email", s.getEmail());
            map.put("profilePicture", s.getProfilePicture());
            map.put("college", s.getCollege());
            map.put("branch", s.getBranch());
            map.put("year", s.getYearOfStudy());
            map.put("bio", s.getBio());
            map.put("skills", s.getSkills());
            map.put("currentGoals", s.getCurrentGoals());
            map.put("activityStatus", s.getActivityStatus());
            map.put("match", match);
            result.add(map);
        }

        return ResponseEntity.ok(Map.of("students", result));
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getStudentProfile(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable String id) {

        User currentUser = getCurrentUser(authHeader);
        Optional<User> targetOpt = userRepository.findById(id);

        if (targetOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User target = targetOpt.get();
        RecommendationService.MatchResult match = recommendationService.calculateCompatibility(currentUser, target);

        Map<String, Object> response = new HashMap<>();
        response.put("student", target);
        response.put("match", match);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/onboarding")
    public ResponseEntity<?> completeOnboarding(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, Object> body) {

        User user = getCurrentUser(authHeader);
        if (body.containsKey("college")) user.setCollege((String) body.get("college"));
        if (body.containsKey("branch")) user.setBranch((String) body.get("branch"));
        if (body.containsKey("year")) user.setYearOfStudy((String) body.get("year"));
        if (body.containsKey("bio")) user.setBio((String) body.get("bio"));
        if (body.containsKey("activityStatus")) user.setActivityStatus((String) body.get("activityStatus"));
        user.setOnboarded(true);

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("user", user));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, Object> body) {

        User user = getCurrentUser(authHeader);
        if (body.containsKey("activityStatus")) user.setActivityStatus((String) body.get("activityStatus"));
        if (body.containsKey("bio")) user.setBio((String) body.get("bio"));

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("user", user));
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
