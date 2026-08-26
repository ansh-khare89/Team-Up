package com.teamup.repository;

import com.teamup.entity.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OpportunityRepository extends JpaRepository<Opportunity, String> {
    List<Opportunity> findAllByOrderByCreatedAtDesc();
}
