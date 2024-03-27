package com.drvolte.spring_server.dao;

import com.drvolte.spring_server.entity.CallBacks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CallBacksRepository extends JpaRepository<CallBacks, Long> {
}