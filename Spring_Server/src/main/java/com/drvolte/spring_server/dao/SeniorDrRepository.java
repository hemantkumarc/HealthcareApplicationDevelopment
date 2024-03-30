package com.drvolte.spring_server.dao;

import com.drvolte.spring_server.entity.SeniorDr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeniorDrRepository extends JpaRepository<SeniorDr, Long> {
}