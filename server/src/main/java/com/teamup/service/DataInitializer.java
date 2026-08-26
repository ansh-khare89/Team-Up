package com.teamup.service;

import com.teamup.entity.*;
import com.teamup.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ConnectionRepository connectionRepository;
    private final MessageRepository messageRepository;
    private final OpportunityRepository opportunityRepository;
    private final NotificationRepository notificationRepository;

    public DataInitializer(UserRepository userRepository, ConnectionRepository connectionRepository,
                           MessageRepository messageRepository, OpportunityRepository opportunityRepository,
                           NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.connectionRepository = connectionRepository;
        this.messageRepository = messageRepository;
        this.opportunityRepository = opportunityRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) return;

        // User 1: Ansh Kumar (Logged in user)
        User ansh = new User("user-anshk", "Ansh Kumar", "ansh@iitb.ac.in", "password123", "IIT Bombay", "Computer Science & Engineering", "3rd Year");
        ansh.setProfilePicture("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400");
        ansh.setBio("Passionate about AI/ML & Fullstack web apps. Building agents & scalable tools for college students.");
        ansh.setActivityStatus("Actively Looking");
        ansh.setOnboarded(true);
        ansh.setCurrentGoals(Arrays.asList("hackathon_teammate", "project_collaborator", "dsa_partner"));
        ansh.setAvailabilityDays(Arrays.asList("Monday", "Wednesday", "Saturday", "Sunday"));
        ansh.setAvailabilityTime("Evening (6 PM - 10 PM)");
        ansh.setGithub("https://github.com/anshkumar");
        ansh.setLinkedin("https://linkedin.com/in/anshkumar");

        Skill s1 = new Skill("Python", "Programming Languages", "Advanced", ansh);
        Skill s2 = new Skill("Machine Learning", "AI / Machine Learning", "Intermediate", ansh);
        Skill s3 = new Skill("React", "Web Development", "Advanced", ansh);
        Skill s4 = new Skill("Node.js", "Web Development", "Intermediate", ansh);
        Skill s5 = new Skill("DSA", "Problem Solving", "Advanced", ansh);
        ansh.setSkills(Arrays.asList(s1, s2, s3, s4, s5));

        DsaProfile dsaAnsh = new DsaProfile("LeetCode", "Advanced", "C++", 2, "Night", 12, "2026-08-26");
        ansh.setDsaProfile(dsaAnsh);
        userRepository.save(ansh);

        // User 2: Rahul Sharma
        User rahul = new User("user-rahul", "Rahul Sharma", "rahul@bits-pilani.ac.in", "password123", "BITS Pilani", "Computer Science & Engineering", "3rd Year");
        rahul.setProfilePicture("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400");
        rahul.setBio("Deep learning enthusiast working on Computer Vision models. Looking for frontend & web devs for AI hackathons.");
        rahul.setActivityStatus("Actively Looking");
        rahul.setOnboarded(true);
        rahul.setCurrentGoals(Arrays.asList("hackathon_teammate", "project_collaborator"));
        rahul.setAvailabilityDays(Arrays.asList("Friday", "Saturday", "Sunday"));
        rahul.setAvailabilityTime("Night (8 PM - 12 AM)");

        Skill r1 = new Skill("Python", "Programming Languages", "Advanced", rahul);
        Skill r2 = new Skill("Machine Learning", "AI / Machine Learning", "Advanced", rahul);
        Skill r3 = new Skill("Data Science", "AI / Machine Learning", "Intermediate", rahul);
        rahul.setSkills(Arrays.asList(r1, r2, r3));

        DsaProfile dsaRahul = new DsaProfile("LeetCode", "Intermediate", "Python", 2, "Evening", 8, "2026-08-26");
        rahul.setDsaProfile(dsaRahul);
        userRepository.save(rahul);

        // User 3: Priya Patel
        User priya = new User("user-priya", "Priya Patel", "priya@nitt.edu", "password123", "NIT Trichy", "Information Technology", "4th Year");
        priya.setProfilePicture("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400");
        priya.setBio("Frontend craftsman & UI specialist. Love building slick React & Next.js web products with Tailwind CSS.");
        priya.setActivityStatus("Actively Looking");
        priya.setOnboarded(true);
        priya.setCurrentGoals(Arrays.asList("project_collaborator", "hackathon_teammate", "internship_prep"));

        Skill p1 = new Skill("React", "Web Development", "Advanced", priya);
        Skill p2 = new Skill("Next.js", "Web Development", "Advanced", priya);
        Skill p3 = new Skill("UI/UX", "Other Technical Skills", "Advanced", priya);
        priya.setSkills(Arrays.asList(p1, p2, p3));

        DsaProfile dsaPriya = new DsaProfile("LeetCode", "Intermediate", "JavaScript", 1, "Morning", 15, "2026-08-26");
        priya.setDsaProfile(dsaPriya);
        userRepository.save(priya);

        // User 4: Aarav Mehta
        User aarav = new User("user-aarav", "Aarav Mehta", "aarav@iiit.ac.in", "password123", "IIIT Hyderabad", "Computer Science & Engineering", "2nd Year");
        aarav.setProfilePicture("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400");
        aarav.setBio("Candidate Master on Codeforces. Grinding CP & DSA daily. Looking for dedicated mock interview and DSA grind partners.");
        aarav.setActivityStatus("Actively Looking");
        aarav.setOnboarded(true);
        aarav.setCurrentGoals(Arrays.asList("dsa_partner", "mock_interview", "internship_prep"));

        Skill a1 = new Skill("C++", "Programming Languages", "Advanced", aarav);
        Skill a2 = new Skill("DSA", "Problem Solving", "Advanced", aarav);
        Skill a3 = new Skill("Competitive Programming", "Problem Solving", "Advanced", aarav);
        aarav.setSkills(Arrays.asList(a1, a2, a3));

        DsaProfile dsaAarav = new DsaProfile("Codeforces", "Advanced", "C++", 4, "Night", 42, "2026-08-26");
        aarav.setDsaProfile(dsaAarav);
        userRepository.save(aarav);

        // Connections
        Connection conn1 = new Connection("conn-1", rahul, ansh, "Accepted");
        Connection conn2 = new Connection("conn-2", priya, ansh, "Pending");
        Connection conn3 = new Connection("conn-3", ansh, aarav, "Pending");
        connectionRepository.saveAll(Arrays.asList(conn1, conn2, conn3));

        // Messages
        Message m1 = new Message("msg-1", "user-rahul", "user-anshk", "Hey Ansh! Saw your Team Up profile. You have great ML + Web Dev skills!");
        Message m2 = new Message("msg-2", "user-anshk", "user-rahul", "Hey Rahul! Thanks! I saw you work on PyTorch & Computer Vision. Are you building anything for Smart India Hackathon?");
        Message m3 = new Message("msg-3", "user-rahul", "user-anshk", "Yes! We are building an AI agent campus assistant. We need someone strong in React & API integration. Want to team up?");
        messageRepository.saveAll(Arrays.asList(m1, m2, m3));

        // Opportunities
        Opportunity opp1 = new Opportunity("opp-1", rahul, "🚀 Building an AI Campus Assistant Agent", "Looking for a React / Tailwind developer and Node.js backend developer to build the frontend dashboard and WebSocket streaming server for an AI Agent application.", "Hackathon");
        opp1.setRequiredSkills(Arrays.asList("React", "Tailwind CSS", "Node.js", "Python"));
        opp1.setInterestedUsers(Arrays.asList(ansh, priya));

        Opportunity opp2 = new Opportunity("opp-2", priya, "🎨 Open Source Design System & React UI Component Library", "Collaborate on creating a modern, accessible Tailwind UI component library for tech student portfolio websites.", "Open Source");
        opp2.setRequiredSkills(Arrays.asList("React", "TypeScript", "UI/UX", "Tailwind CSS"));

        Opportunity opp3 = new Opportunity("opp-3", aarav, "🧠 LeetCode 75 Hard Sprint (Graph & Dynamic Programming)", "Forming a tight-knit study squad of 3-4 students targeting top tier tech SDE interviews. Daily 2 problem discussion at 10 PM.", "DSA Study Group");
        opp3.setRequiredSkills(Arrays.asList("C++", "Java", "DSA", "LeetCode"));
        opp3.setInterestedUsers(Arrays.asList(ansh));

        opportunityRepository.saveAll(Arrays.asList(opp1, opp2, opp3));

        // Notifications
        Notification n1 = new Notification("notif-1", "user-anshk", "user-priya", "connection_request", "New Connection Request", "Priya Patel (NIT Trichy) wants to connect with you.");
        Notification n2 = new Notification("notif-2", "user-anshk", "user-rahul", "connection_accepted", "Connection Accepted 🎉", "Rahul Sharma (BITS Pilani) accepted your connection request.");
        notificationRepository.saveAll(Arrays.asList(n1, n2));

        System.out.println("✅ Spring Data JPA relational database pre-populated successfully!");
    }
}
