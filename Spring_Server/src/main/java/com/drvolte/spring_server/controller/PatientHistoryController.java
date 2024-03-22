package com.drvolte.spring_server.controller;

import com.drvolte.spring_server.entity.PatientHistory;
import com.drvolte.spring_server.service.PatientHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patienthistory")
public class PatientHistoryController {


    private final PatientHistoryService patientHistoryService;


    public PatientHistoryController(PatientHistoryService patientHistoryService) {
        this.patientHistoryService = patientHistoryService;
    }

    @PostMapping("/")
    public ResponseEntity<PatientHistory> createPatientHistory(@RequestBody PatientHistory patient) {
        return ResponseEntity.ok(patientHistoryService.createPatientHistory(patient));

    }

    @GetMapping("/removeconsent/{id}")
    public ResponseEntity<Boolean> updatePatientHistoryConsent(@PathVariable("id") Long id) {
        return ResponseEntity.ok(patientHistoryService.updatePatientHistoryConsent(id));

    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientHistory> getPatientHistoryById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(patientHistoryService.getPatientHistoryById(id));
    }

}