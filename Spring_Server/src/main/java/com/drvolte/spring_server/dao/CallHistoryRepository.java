package com.drvolte.spring_server.dao;

import com.drvolte.spring_server.entity.CallHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CallHistoryRepository extends JpaRepository<CallHistory, Long> {

    @RestResource(path = "/byids")
    List<CallHistory> findByCounsellorIdIdOrPatientIdIdOrderByCallStart(
            @Param(value = "counsellorid") Long counsellorId,
            @Param(value = "patientid") Long patientId
    );


}