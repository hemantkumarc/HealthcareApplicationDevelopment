package com.drvolte.spring_server.dao;

import com.drvolte.spring_server.entity.CallBack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CallBackRepository extends JpaRepository<CallBack, Long> {
    @RestResource(path = "/byattributes")
    List<CallBack> findByCounsellorIdOrPatientIdOrStatus(
            @Param(value = "counsellorid") Long counsellorId,
            @Param(value = "patientid") Long patientId,
            @Param(value = "status") String status
    );

}