package com.drvolte.spring_server.controller;

import com.drvolte.spring_server.config.UserAuthenticationProvider;
import com.drvolte.spring_server.dtos.PatientRequestDto;
import com.drvolte.spring_server.dtos.PatientResponseDto;
import com.drvolte.spring_server.entity.Patient;
import com.drvolte.spring_server.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PatientsController {

    @Autowired
    private PatientService patientservice;

    @Autowired
    private UserAuthenticationProvider userAuthenticationProvider;

    @PostMapping("/patients_register")
    public ResponseEntity<PatientResponseDto> registerPatient(@RequestBody PatientRequestDto patientRequest) {
        PatientResponseDto patientResponse = patientservice.registerOrLogin(patientRequest);
        patientResponse.setToken(userAuthenticationProvider.createTokenForPatient(patientResponse));
        return ResponseEntity.ok(patientResponse);
    }

    @GetMapping("/get_families")
    public ResponseEntity<List<Patient>> getFamilies(@RequestParam(value = "patient_id") Long patientId) {
        List<Patient> patients = patientservice.getFamilies(patientId);
        return ResponseEntity.ok(patients);
    }
}