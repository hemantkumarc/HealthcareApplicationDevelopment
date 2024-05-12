package com.drvolte.spring_server.dao;

import com.drvolte.spring_server.entity.PatientHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Repository
public interface PatientHistoryRepository extends JpaRepository<PatientHistory, Long> {
    @RestResource(path = "/byattributes")
    List<PatientHistory> findByPatientIdOrConsent(
            @Param(value = "patientid") Long patientId,
            @RequestParam(value = "consent", defaultValue = "true") Boolean consent
    );
}