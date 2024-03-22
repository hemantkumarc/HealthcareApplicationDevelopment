package com.drvolte.spring_server.dao;

import com.drvolte.spring_server.entity.Counsellor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CounsellorRepository extends JpaRepository<Counsellor, Long> {
}