package com.drvolte.spring_server.dao;

import com.drvolte.spring_server.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    @RestResource(path = "byAttributes")
    List<Doctor> findDoctorsByEmailOrQualificationOrSpecialization(
            @Param(value = "email") String email,
            @Param(value = "specialization") String specialization,
            @Param(value = "Qualification") String qualification
    );

    @RestResource(path = "byAttributesLike")
    List<Doctor> findDoctorsByQualificationIsLikeIgnoreCaseOrSpecializationIsLikeIgnoreCase(
            @Param(value = "qualification") String qualification,
            @Param(value = "specialization") String specialization
    );

} 