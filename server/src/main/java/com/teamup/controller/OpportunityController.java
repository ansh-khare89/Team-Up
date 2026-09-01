package com.teamup.controller;

import com.teamup.entity.Opportunity;
import com.teamup.entity.User;
import com.teamup.repository.OpportunityRepository;
import com.teamup.repository.UserRepository;
import com.teamup.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    private final OpportunityRepository opportunityRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public OpportunityController(OpportunityRepository opportunityRepository, UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
        this.opportunityRepository = opportunityRepository;
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping
    public ResponseEntity<?> getOpportunities(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        User currentUser = getCurrentUser(authHeader);
        List<Opportunity> opportunities = opportunityRepository.findAllByOrderByCreatedAtDesc();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Opportunity opp : opportunities) {
            boolean isInterested = opp.getInterestedUsers().stream().anyMatch(u -> u.getId().equals(currentUser.getId()));
            Map<String, Object> map = new HashMap<>();
            map.put("id", opp.getId());
            map.put("creatorId", opp.getCreator().getId());
            map.put("title", opp.getTitle());
            map.put("description", opp.getDescription());
            map.put("category", opp.getCategory());
            map.put("requiredSkills", opp.getRequiredSkills());
            map.put("creator", opp.getCreator());
            map.put("interestedUsers", opp.getInterestedUsers());
            map.put("isInterested", isInterested);
            map.put("createdAt", opp.getCreatedAt());
            result.add(map);
        }

        return ResponseEntity.ok(Map.of("opportunities", result));
    }

    @PostMapping
    public ResponseEntity<?> createOpportunity(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, Object> body) {

        User creator = getCurrentUser(authHeader);
        String title = (String) body.get("title");
        String description = (String) body.get("description");
        String category = (String) body.getOrDefault("category", "Project");
        List<String> requiredSkills = (List<String>) body.getOrDefault("requiredSkills", new ArrayList<>());

        String oppId = "opp-" + UUID.randomUUID().toString().substring(0, 8);
        Opportunity opp = new Opportunity(oppId, creator, title, description, category);
        opp.setRequiredSkills(requiredSkills);
        opp.setCreatedAt(LocalDateTime.now());

        opportunityRepository.save(opp);
        return ResponseEntity.ok(Map.of("opportunity", opp));
    }

    @PostMapping("/{id}/interest")
    public ResponseEntity<?> toggleInterest(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable String id) {

        User currentUser = getCurrentUser(authHeader);
        Optional<Opportunity> oppOpt = opportunityRepository.findById(id);

        if (oppOpt.isEmpty()) return ResponseEntity.notFound().build();

        Opportunity opp = oppOpt.get();
        boolean alreadyInterested = opp.getInterestedUsers().stream().anyMatch(u -> u.getId().equals(currentUser.getId()));

        if (alreadyInterested) {
            opp.getInterestedUsers().removeIf(u -> u.getId().equals(currentUser.getId()));
        } else {
            opp.getInterestedUsers().add(currentUser);
        }

        opportunityRepository.save(opp);
        return ResponseEntity.ok(Map.of("opportunity", opp));
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
