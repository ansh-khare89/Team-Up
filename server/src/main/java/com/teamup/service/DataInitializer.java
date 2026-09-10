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

        // User 5: Sneha Rao
        User sneha = new User("user-sneha", "Sneha Rao", "sneha@iitd.ac.in", "password123", "IIT Delhi", "Electrical & Computer Engg", "3rd Year");
        sneha.setProfilePicture("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400");
        sneha.setBio("Cross-platform mobile engineer building smooth Flutter & React Native apps. Keen on fintech and edtech hackathons.");
        sneha.setActivityStatus("Actively Looking");
        sneha.setOnboarded(true);
        sneha.setCurrentGoals(Arrays.asList("hackathon_teammate", "project_collaborator"));
        sneha.setAvailabilityDays(Arrays.asList("Saturday", "Sunday", "Tuesday"));
        sneha.setAvailabilityTime("Evening (5 PM - 9 PM)");
        Skill sn1 = new Skill("Flutter", "Mobile App Development", "Advanced", sneha);
        Skill sn2 = new Skill("Dart", "Programming Languages", "Advanced", sneha);
        Skill sn3 = new Skill("Firebase", "Backend Development", "Intermediate", sneha);
        Skill sn4 = new Skill("UI/UX", "Design", "Intermediate", sneha);
        sneha.setSkills(Arrays.asList(sn1, sn2, sn3, sn4));
        DsaProfile dsaSneha = new DsaProfile("LeetCode", "Intermediate", "Java", 2, "Evening", 19, "2026-08-26");
        sneha.setDsaProfile(dsaSneha);
        userRepository.save(sneha);

        // User 6: Rohan Verma
        User rohan = new User("user-rohan", "Rohan Verma", "rohan@goa.bits-pilani.ac.in", "password123", "BITS Goa", "Computer Science", "4th Year");
        rohan.setProfilePicture("https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400");
        rohan.setBio("Backend & Cloud Systems builder. Golang, Kubernetes & high-concurrency microservices nerd. Looking for hackathon squads.");
        rohan.setActivityStatus("Actively Looking");
        rohan.setOnboarded(true);
        rohan.setCurrentGoals(Arrays.asList("hackathon_teammate", "project_collaborator", "internship_prep"));
        rohan.setAvailabilityDays(Arrays.asList("Friday", "Saturday", "Sunday"));
        rohan.setAvailabilityTime("Night (9 PM - 1 AM)");
        Skill rk1 = new Skill("Go", "Programming Languages", "Advanced", rohan);
        Skill rk2 = new Skill("Docker", "DevOps & Cloud", "Advanced", rohan);
        Skill rk3 = new Skill("Kubernetes", "DevOps & Cloud", "Intermediate", rohan);
        Skill rk4 = new Skill("PostgreSQL", "Databases", "Advanced", rohan);
        rohan.setSkills(Arrays.asList(rk1, rk2, rk3, rk4));
        DsaProfile dsaRohan = new DsaProfile("Codeforces", "Advanced", "C++", 3, "Night", 28, "2026-08-26");
        rohan.setDsaProfile(dsaRohan);
        userRepository.save(rohan);

        // User 7: Ananya Gupta
        User ananya = new User("user-ananya", "Ananya Gupta", "ananya@dtu.ac.in", "password123", "DTU Delhi", "Information Technology", "2nd Year");
        ananya.setProfilePicture("https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400");
        ananya.setBio("Full stack developer passionate about TypeScript, Next.js, and clean Tailwind design systems. Looking for study and build buddies!");
        ananya.setActivityStatus("Open to Opportunities");
        ananya.setOnboarded(true);
        ananya.setCurrentGoals(Arrays.asList("hackathon_teammate", "dsa_partner"));
        ananya.setAvailabilityDays(Arrays.asList("Monday", "Thursday", "Saturday"));
        ananya.setAvailabilityTime("Afternoon (2 PM - 6 PM)");
        Skill ag1 = new Skill("Next.js", "Web Development", "Advanced", ananya);
        Skill ag2 = new Skill("TypeScript", "Programming Languages", "Advanced", ananya);
        Skill ag3 = new Skill("Tailwind CSS", "Web Development", "Advanced", ananya);
        Skill ag4 = new Skill("GraphQL", "Web Development", "Intermediate", ananya);
        ananya.setSkills(Arrays.asList(ag1, ag2, ag3, ag4));
        DsaProfile dsaAnanya = new DsaProfile("LeetCode", "Intermediate", "JavaScript", 2, "Evening", 14, "2026-08-26");
        ananya.setDsaProfile(dsaAnanya);
        userRepository.save(ananya);

        // User 8: Vikram Singh
        User vikram = new User("user-vikram", "Vikram Singh", "vikram@iitr.ac.in", "password123", "IIT Roorkee", "Artificial Intelligence & Data Science", "3rd Year");
        vikram.setProfilePicture("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400");
        vikram.setBio("Researcher in Generative AI, PyTorch & LLM fine-tuning. Looking for full-stack wizards to wrap cutting-edge ML models into apps.");
        vikram.setActivityStatus("Actively Looking");
        vikram.setOnboarded(true);
        vikram.setCurrentGoals(Arrays.asList("hackathon_teammate", "project_collaborator"));
        vikram.setAvailabilityDays(Arrays.asList("Tuesday", "Thursday", "Saturday", "Sunday"));
        vikram.setAvailabilityTime("Evening (7 PM - 11 PM)");
        Skill v1 = new Skill("PyTorch", "AI / Machine Learning", "Advanced", vikram);
        Skill v2 = new Skill("Python", "Programming Languages", "Advanced", vikram);
        Skill v3 = new Skill("NLP", "AI / Machine Learning", "Advanced", vikram);
        Skill v4 = new Skill("FastAPI", "Web Development", "Intermediate", vikram);
        vikram.setSkills(Arrays.asList(v1, v2, v3, v4));
        DsaProfile dsaVikram = new DsaProfile("LeetCode", "Advanced", "Python", 3, "Night", 35, "2026-08-26");
        vikram.setDsaProfile(dsaVikram);
        userRepository.save(vikram);

        // User 9: Kavya Nair
        User kavya = new User("user-kavya", "Kavya Nair", "kavya@nitk.edu.in", "password123", "NIT Surathkal", "Computer Engineering", "3rd Year");
        kavya.setProfilePicture("https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400");
        kavya.setBio("Enterprise Java & Spring Boot backend enthusiast. Practicing daily system design and SDE interview mocks.");
        kavya.setActivityStatus("Actively Looking");
        kavya.setOnboarded(true);
        kavya.setCurrentGoals(Arrays.asList("internship_prep", "mock_interview", "dsa_partner"));
        kavya.setAvailabilityDays(Arrays.asList("Monday", "Wednesday", "Friday"));
        kavya.setAvailabilityTime("Night (8 PM - 11 PM)");
        Skill k1 = new Skill("Java", "Programming Languages", "Advanced", kavya);
        Skill k2 = new Skill("Spring Boot", "Web Development", "Advanced", kavya);
        Skill k3 = new Skill("PostgreSQL", "Databases", "Intermediate", kavya);
        Skill k4 = new Skill("Microservices", "Architecture", "Intermediate", kavya);
        kavya.setSkills(Arrays.asList(k1, k2, k3, k4));
        DsaProfile dsaKavya = new DsaProfile("LeetCode", "Advanced", "Java", 2, "Evening", 24, "2026-08-26");
        kavya.setDsaProfile(dsaKavya);
        userRepository.save(kavya);

        // User 10: Devansh Joshi
        User devansh = new User("user-devansh", "Devansh Joshi", "devansh@iiitb.ac.in", "password123", "IIIT Bangalore", "Computer Science", "2nd Year");
        devansh.setProfilePicture("https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400");
        devansh.setBio("Rustacean & Systems developer. Building WebAssembly runtimes and low-latency network tools. Codeforces Expert.");
        devansh.setActivityStatus("Open to Opportunities");
        devansh.setOnboarded(true);
        devansh.setCurrentGoals(Arrays.asList("project_collaborator", "dsa_partner"));
        devansh.setAvailabilityDays(Arrays.asList("Saturday", "Sunday"));
        devansh.setAvailabilityTime("All Day");
        Skill dj1 = new Skill("Rust", "Programming Languages", "Advanced", devansh);
        Skill dj2 = new Skill("C++", "Programming Languages", "Advanced", devansh);
        Skill dj3 = new Skill("WebAssembly", "Web Development", "Intermediate", devansh);
        Skill dj4 = new Skill("Linux", "Systems", "Advanced", devansh);
        devansh.setSkills(Arrays.asList(dj1, dj2, dj3, dj4));
        DsaProfile dsaDevansh = new DsaProfile("Codeforces", "Advanced", "C++", 3, "Night", 50, "2026-08-26");
        devansh.setDsaProfile(dsaDevansh);
        userRepository.save(devansh);

        // User 11: Tanvi Deshmukh
        User tanvi = new User("user-tanvi", "Tanvi Deshmukh", "tanvi@vjti.ac.in", "password123", "VJTI Mumbai", "Electronics & Telecommunication", "4th Year");
        tanvi.setProfilePicture("https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400");
        tanvi.setBio("AWS Certified Cloud Architect & DevOps lover. Terraform, CI/CD pipelines & container infrastructure.");
        tanvi.setActivityStatus("Actively Looking");
        tanvi.setOnboarded(true);
        tanvi.setCurrentGoals(Arrays.asList("hackathon_teammate", "internship_prep"));
        tanvi.setAvailabilityDays(Arrays.asList("Friday", "Saturday"));
        tanvi.setAvailabilityTime("Evening (6 PM - 10 PM)");
        Skill td1 = new Skill("AWS", "DevOps & Cloud", "Advanced", tanvi);
        Skill td2 = new Skill("Terraform", "DevOps & Cloud", "Intermediate", tanvi);
        Skill td3 = new Skill("Docker", "DevOps & Cloud", "Advanced", tanvi);
        Skill td4 = new Skill("Python", "Programming Languages", "Intermediate", tanvi);
        tanvi.setSkills(Arrays.asList(td1, td2, td3, td4));
        DsaProfile dsaTanvi = new DsaProfile("HackerRank", "Intermediate", "Python", 1, "Night", 11, "2026-08-26");
        tanvi.setDsaProfile(dsaTanvi);
        userRepository.save(tanvi);

        // User 12: Ishaan Kapoor
        User ishaan = new User("user-ishaan", "Ishaan Kapoor", "ishaan@iitk.ac.in", "password123", "IIT Kanpur", "Computer Science & Engineering", "1st Year");
        ishaan.setProfilePicture("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400");
        ishaan.setBio("Freshman learning fullstack Python/Django & grinding foundational DSA. Looking for peers to study with!");
        ishaan.setActivityStatus("Actively Looking");
        ishaan.setOnboarded(true);
        ishaan.setCurrentGoals(Arrays.asList("dsa_partner", "project_collaborator"));
        ishaan.setAvailabilityDays(Arrays.asList("Monday", "Wednesday", "Saturday", "Sunday"));
        ishaan.setAvailabilityTime("Evening (6 PM - 10 PM)");
        Skill ik1 = new Skill("Python", "Programming Languages", "Intermediate", ishaan);
        Skill ik2 = new Skill("Django", "Web Development", "Intermediate", ishaan);
        Skill ik3 = new Skill("DSA", "Problem Solving", "Intermediate", ishaan);
        Skill ik4 = new Skill("SQL", "Databases", "Beginner", ishaan);
        ishaan.setSkills(Arrays.asList(ik1, ik2, ik3, ik4));
        DsaProfile dsaIshaan = new DsaProfile("LeetCode", "Beginner", "Python", 1, "Evening", 7, "2026-08-26");
        ishaan.setDsaProfile(dsaIshaan);
        userRepository.save(ishaan);

        // User 13: Meera Krishnan
        User meera = new User("user-meera", "Meera Krishnan", "meera@iitm.ac.in", "password123", "IIT Madras", "Data Science & Engineering", "3rd Year");
        meera.setProfilePicture("https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400");
        meera.setBio("Data engineer building batch & streaming data pipelines. Spark, Kafka & BigQuery. Looking for hackathon datasets & team!");
        meera.setActivityStatus("Open to Opportunities");
        meera.setOnboarded(true);
        meera.setCurrentGoals(Arrays.asList("hackathon_teammate", "project_collaborator"));
        meera.setAvailabilityDays(Arrays.asList("Saturday", "Sunday"));
        meera.setAvailabilityTime("Morning (9 AM - 1 PM)");
        Skill mk1 = new Skill("Data Science", "AI / Machine Learning", "Advanced", meera);
        Skill mk2 = new Skill("Python", "Programming Languages", "Advanced", meera);
        Skill mk3 = new Skill("SQL", "Databases", "Advanced", meera);
        Skill mk4 = new Skill("Kafka", "Backend Development", "Intermediate", meera);
        meera.setSkills(Arrays.asList(mk1, mk2, mk3, mk4));
        DsaProfile dsaMeera = new DsaProfile("LeetCode", "Intermediate", "Python", 2, "Morning", 21, "2026-08-26");
        meera.setDsaProfile(dsaMeera);
        userRepository.save(meera);

        // User 14: Siddharth Jain
        User siddharth = new User("user-siddharth", "Siddharth Jain", "siddharth@nsut.ac.in", "password123", "NSUT Delhi", "Information Technology", "3rd Year");
        siddharth.setProfilePicture("https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400");
        siddharth.setBio("Cybersecurity & network security enthusiast. CTF player, ethical hacking & web security auditor. Looking for build partners.");
        siddharth.setActivityStatus("Actively Looking");
        siddharth.setOnboarded(true);
        siddharth.setCurrentGoals(Arrays.asList("hackathon_teammate", "project_collaborator"));
        siddharth.setAvailabilityDays(Arrays.asList("Friday", "Saturday", "Sunday"));
        siddharth.setAvailabilityTime("Night (8 PM - 12 AM)");
        Skill sj1 = new Skill("Cyber Security", "Other Technical Skills", "Advanced", siddharth);
        Skill sj2 = new Skill("Python", "Programming Languages", "Advanced", siddharth);
        Skill sj3 = new Skill("Linux", "Systems", "Advanced", siddharth);
        Skill sj4 = new Skill("Node.js", "Web Development", "Intermediate", siddharth);
        siddharth.setSkills(Arrays.asList(sj1, sj2, sj3, sj4));
        DsaProfile dsaSiddharth = new DsaProfile("LeetCode", "Intermediate", "C++", 2, "Night", 16, "2026-08-26");
        siddharth.setDsaProfile(dsaSiddharth);
        userRepository.save(siddharth);

        // Connections
        Connection conn1 = new Connection("conn-1", rahul, ansh, "Accepted");
        Connection conn2 = new Connection("conn-2", priya, ansh, "Pending");
        Connection conn3 = new Connection("conn-3", ansh, aarav, "Pending");
        Connection conn4 = new Connection("conn-4", sneha, ansh, "Accepted");
        Connection conn5 = new Connection("conn-5", rohan, ansh, "Accepted");
        Connection conn6 = new Connection("conn-6", ananya, ansh, "Pending");
        Connection conn7 = new Connection("conn-7", ansh, vikram, "Pending");
        Connection conn8 = new Connection("conn-8", kavya, ansh, "Accepted");
        connectionRepository.saveAll(Arrays.asList(conn1, conn2, conn3, conn4, conn5, conn6, conn7, conn8));

        // Messages
        Message m1 = new Message("msg-1", "user-rahul", "user-anshk", "Hey Ansh! Saw your Team Up profile. You have great ML + Web Dev skills!");
        Message m2 = new Message("msg-2", "user-anshk", "user-rahul", "Hey Rahul! Thanks! I saw you work on PyTorch & Computer Vision. Are you building anything for Smart India Hackathon?");
        Message m3 = new Message("msg-3", "user-rahul", "user-anshk", "Yes! We are building an AI agent campus assistant. We need someone strong in React & API integration. Want to team up?");
        Message m4 = new Message("msg-4", "user-sneha", "user-anshk", "Hi Ansh! Loved your profile. Would you be interested in pairing up for a mobile + web project?");
        Message m5 = new Message("msg-5", "user-anshk", "user-sneha", "Hey Sneha! Absolutely, your Flutter experience sounds awesome. Let's discuss ideas!");
        Message m6 = new Message("msg-6", "user-kavya", "user-anshk", "Hey Ansh! Are you practicing DSA graphs and trees today?");
        messageRepository.saveAll(Arrays.asList(m1, m2, m3, m4, m5, m6));

        // Opportunities
        Opportunity opp1 = new Opportunity("opp-1", rahul, "🚀 Building an AI Campus Assistant Agent", "Looking for a React / Tailwind developer and Node.js backend developer to build the frontend dashboard and WebSocket streaming server for an AI Agent application.", "Hackathon");
        opp1.setRequiredSkills(Arrays.asList("React", "Tailwind CSS", "Node.js", "Python"));
        opp1.setInterestedUsers(Arrays.asList(ansh, priya, sneha));

        Opportunity opp2 = new Opportunity("opp-2", priya, "🎨 Open Source Design System & React UI Component Library", "Collaborate on creating a modern, accessible Tailwind UI component library for tech student portfolio websites.", "Open Source");
        opp2.setRequiredSkills(Arrays.asList("React", "TypeScript", "UI/UX", "Tailwind CSS"));
        opp2.setInterestedUsers(Arrays.asList(ananya));

        Opportunity opp3 = new Opportunity("opp-3", aarav, "🧠 LeetCode 75 Hard Sprint (Graph & Dynamic Programming)", "Forming a tight-knit study squad of 3-4 students targeting top tier tech SDE interviews. Daily 2 problem discussion at 10 PM.", "DSA Study Group");
        opp3.setRequiredSkills(Arrays.asList("C++", "Java", "DSA", "LeetCode"));
        opp3.setInterestedUsers(Arrays.asList(ansh, kavya, ishaan));

        Opportunity opp4 = new Opportunity("opp-4", sneha, "📱 Cross-Platform Campus Marketplace App", "Building an offline-first Flutter mobile application for students to buy, sell, and exchange textbooks and project hardware kits on campus.", "Project");
        opp4.setRequiredSkills(Arrays.asList("Flutter", "Dart", "Firebase", "UI/UX"));
        opp4.setInterestedUsers(Arrays.asList(ansh, ananya));

        Opportunity opp5 = new Opportunity("opp-5", vikram, "🤖 Autonomous Multimodal Agent for Academic Research", "Developing a fine-tuned open-source LLM research paper summarizer and question-answering tool. Looking for frontend & backend contributors.", "Research");
        opp5.setRequiredSkills(Arrays.asList("Python", "PyTorch", "FastAPI", "React"));
        opp5.setInterestedUsers(Arrays.asList(ansh, rohan));

        Opportunity opp6 = new Opportunity("opp-6", rohan, "⚡ High-Throughput Distributed Rate Limiter & Gateway", "Open-source Go project implementing distributed Token Bucket & Leaky Bucket algorithms with Redis & eBPF metrics.", "Open Source");
        opp6.setRequiredSkills(Arrays.asList("Go", "Docker", "PostgreSQL", "Kubernetes"));
        opp6.setInterestedUsers(Arrays.asList(devansh));

        opportunityRepository.saveAll(Arrays.asList(opp1, opp2, opp3, opp4, opp5, opp6));

        // Notifications
        Notification n1 = new Notification("notif-1", "user-anshk", "user-priya", "connection_request", "New Connection Request", "Priya Patel (NIT Trichy) wants to connect with you.");
        Notification n2 = new Notification("notif-2", "user-anshk", "user-rahul", "connection_accepted", "Connection Accepted 🎉", "Rahul Sharma (BITS Pilani) accepted your connection request.");
        Notification n3 = new Notification("notif-3", "user-anshk", "user-sneha", "connection_accepted", "Connection Accepted 🎉", "Sneha Rao (IIT Delhi) accepted your connection request.");
        Notification n4 = new Notification("notif-4", "user-anshk", "user-ananya", "connection_request", "New Connection Request", "Ananya Gupta (DTU Delhi) wants to connect with you.");
        notificationRepository.saveAll(Arrays.asList(n1, n2, n3, n4));

        System.out.println("✅ Spring Data JPA relational database pre-populated successfully with 14 active campus student profiles!");
    }
}
