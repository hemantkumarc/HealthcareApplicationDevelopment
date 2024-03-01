package com.drvolte.spring_server.service;

import com.drvolte.spring_server.dao.PatientRepository;
import com.drvolte.spring_server.dtos.PatientRequestDto;
import com.drvolte.spring_server.dtos.PatientResponseDto;
import com.drvolte.spring_server.entity.Patient;
import com.drvolte.spring_server.mappers.PatientMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired  // Add this annotation for autowiring
    private PatientMapper patientMapper;

    public PatientResponseDto registerOrLogin(PatientRequestDto patientRequest) {
        System.out.println("Patients Phnumber: " + patientRequest.phnumber());

        Optional<Patient> existingPatientOptional = patientRepository.findPatientByPhNumber(patientRequest.phnumber());

        if (existingPatientOptional.isPresent()) {
            Patient existingPatient = existingPatientOptional.get();
            System.out.println("Present" + existingPatient);
            return patientMapper.patientToPatientResponseDto(existingPatient);
        } else {
            // Create a new patient
            System.out.println("Not Present");
            Patient newPatient = patientMapper.patientRequestDtoToPatient(patientRequest);
            Patient savedPatient = patientRepository.save(newPatient);
            return patientMapper.patientToPatientResponseDto(savedPatient);
        }
    }
}