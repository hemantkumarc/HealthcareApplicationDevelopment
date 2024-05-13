package com.drvolte.spring_server.service;

import com.drvolte.spring_server.dao.PatientRepository;
import com.drvolte.spring_server.dtos.PatientRequestDto;
import com.drvolte.spring_server.dtos.PatientResponseDto;
import com.drvolte.spring_server.entity.Patient;
import com.drvolte.spring_server.mappers.PatientMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired  // Add this annotation for autowiring
    private PatientMapper patientMapper;

    public PatientResponseDto registerOrLogin(PatientRequestDto patientRequest) {
        System.out.println("Patients Phnumber: " + patientRequest.phnumber());

        List<Patient> existingPatientOptional = patientRepository.findAllByPhNumber(patientRequest.phnumber());
        System.out.println("this is the response for DataBase for searching by Phnumber" + existingPatientOptional);
        if (!existingPatientOptional.isEmpty()) {
            Patient existingPatient = existingPatientOptional.get(0);
            System.out.println("Present" + existingPatient);
            PatientResponseDto temp = patientMapper.patientToPatientResponseDto(existingPatient);
            temp.setRole("ROLE_PATIENT");
            return temp;
        } else {
            // Create a new patient
            System.out.println("Not Present");
            Patient newPatient = patientMapper.patientRequestDtoToPatient(patientRequest);
            Patient savedPatient = patientRepository.save(newPatient);
            PatientResponseDto temp = patientMapper.patientToPatientResponseDto(savedPatient);
            temp.setRole("ROLE_PATIENT");
            return temp;
        }
    }

    public List<Patient> getFamilies(Long patientId) {
        Optional<Patient> patientsOptional = patientRepository.findById(patientId);
        if (patientsOptional.isPresent()) {
            String phNumber = patientsOptional.get().getPhNumber();
            return patientRepository.findAllByPhNumber(phNumber);
        } else {
            return new ArrayList<Patient>();
        }

    }
}