package com.drvolte.spring_server.dao;

import com.drvolte.spring_server.entity.Counsellor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CounsellorRepository extends JpaRepository<Counsellor, Long> {
    @RestResource(path = "byAttributes")
    List<Counsellor> findCounsellorsByEmailOrQualificationOrSpecialization(
            @Param(value = "email") String email,
            @Param(value = "specialization") String specialization,
            @Param(value = "Qualification") String qualification
    );

    @RestResource(path = "byAttributesLike")
    List<Counsellor> findCounsellorsByQualificationContainingIgnoreCaseOrSpecializationContainingIgnoreCase(
            @Param(value = "qualification") String qualification,
            @Param(value = "specialization") String specialization
    );
}