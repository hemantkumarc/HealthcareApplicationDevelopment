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
    List<CallHistory> findByPatientIdOrCounsellorIdOrderByCallStart(
            @Param(value = "patientid") Long patientId,

            @Param(value = "counsellorid") Long counsellorId
    );


    @RestResource(path = "/patientIdAndStatus")
    List<CallHistory> findByPatientIdAndStatus(
            @Param(value = "patientid") Long patientId,
            @Param(value = "status") String status
    );

}