package com.drvolte.spring_server.dao;

import com.drvolte.spring_server.entity.CallBack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CallBackRepository extends JpaRepository<CallBack, Long> {
}