package com.drvolte.spring_server.service;

import com.drvolte.spring_server.dao.PatientHistoryRepository;
import com.drvolte.spring_server.entity.PatientHistory;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PatientHistoryService {

    private final PatientHistoryRepository patientHistoryRepository;

    public PatientHistoryService(PatientHistoryRepository patientHistoryRepository) {
        this.patientHistoryRepository = patientHistoryRepository;
    }

    public PatientHistory createPatientHistory(PatientHistory patient) {
        return patientHistoryRepository.save(patient);
    }

    public Boolean updatePatientHistoryConsent(Long id) {
        Optional<PatientHistory> optionalPatientHistory = patientHistoryRepository.findById(id);
        if (optionalPatientHistory.isPresent()) {
            PatientHistory patientHistory = optionalPatientHistory.get();
            patientHistory.setConsent(false);
            patientHistoryRepository.save(patientHistory);
            return true;
        } else {
            return false;
        }
    }


    public PatientHistory getPatientHistoryById(Long id) {
        Optional<PatientHistory> optionalPatientHistory = patientHistoryRepository.findById(id);
        return optionalPatientHistory.orElse(null);
    }
}