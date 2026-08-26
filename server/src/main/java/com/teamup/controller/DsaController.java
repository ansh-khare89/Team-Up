package com.teamup.controller;

import com.teamup.entity.DsaProfile;
import com.teamup.entity.User;
import com.teamup.repository.UserRepository;
import com.teamup.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/dsa")
@CrossOrigin(origins = "*")
public class DsaController {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public DsaController(UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping("/matches")
    public ResponseEntity<?> getDsaMatches(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        User currentUser = getCurrentUser(authHeader);
        List<User> allUsers = userRepository.findAll();

        List<Map<String, Object>> matches = new ArrayList<>();
        for (User u : allUsers) {
            if (!u.getId().equals(currentUser.getId())) {
                DsaProfile dsa = u.getDsaProfile() != null ? u.getDsaProfile() : new DsaProfile("LeetCode", "Intermediate", "C++", 2, "Night", 5, "2026-08-26");
                List<String> highlights = Arrays.asList("Both practice on " + dsa.getPlatform(), "Matching daily problem quota");
                
                Map<String, Object> map = new HashMap<>();
                map.put("student", u);
                map.put("dsaProfile", dsa);
                map.put("compatibilityPercentage", 88);
                map.put("highlights", highlights);
                matches.add(map);
            }
        }

        return ResponseEntity.ok(Map.of("matches", matches));
    }

    @PostMapping("/checkin")
    public ResponseEntity<?> checkIn(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        User currentUser = getCurrentUser(authHeader);
        DsaProfile dsa = currentUser.getDsaProfile();

        if (dsa == null) {
            dsa = new DsaProfile("LeetCode", "Intermediate", "C++", 2, "Night", 1, LocalDate.now().toString());
            currentUser.setDsaProfile(dsa);
        } else {
            dsa.setStreakCount((dsa.getStreakCount() != null ? dsa.getStreakCount() : 0) + 1);
            dsa.setLastCheckIn(LocalDate.now().toString());
        }

        userRepository.save(currentUser);

        return ResponseEntity.ok(Map.of(
            "message", "🔥 Streak updated! You are on a " + dsa.getStreakCount() + "-day streak!",
            "dsaProfile", dsa,
            "user", currentUser
        ));
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
