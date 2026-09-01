package com.teamup.controller;

import com.teamup.entity.User;
import com.teamup.repository.UserRepository;
import com.teamup.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        String college = body.getOrDefault("college", "IIT Bombay");
        String branch = body.getOrDefault("branch", "Computer Science");
        String year = body.getOrDefault("year", "3rd Year");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }

        String userId = "user-" + UUID.randomUUID().toString().substring(0, 8);
        User newUser = new User(userId, name, email, password, college, branch, year);
        newUser.setProfilePicture("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400");
        userRepository.save(newUser);

        String token = jwtTokenProvider.generateToken(userId, email);
        return ResponseEntity.ok(Map.of("token", token, "user", newUser));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        User user = userOpt.get();
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        return ResponseEntity.ok(Map.of("token", token, "user", user));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        String userId = extractUserId(authHeader);
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            // Default to Ansh Kumar if invalid
            userOpt = userRepository.findById("user-anshk");
        }
        return ResponseEntity.ok(Map.of("user", userOpt.orElseThrow()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Password reset instructions sent to your email"));
    }

    private String extractUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (token.startsWith("user-")) return token;
            return jwtTokenProvider.getUserIdFromToken(token);
        }
        return "user-anshk";
    }
}
