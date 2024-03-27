package com.drvolte.spring_server.dao;

import com.drvolte.spring_server.entity.PatientHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientHistoryRepository extends JpaRepository<PatientHistory, Long> {
}