package com.drvolte.spring_server.service;

import com.drvolte.spring_server.dao.DoctorRepository;
import com.drvolte.spring_server.entity.Doctor;
import org.springframework.stereotype.Service;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository theDoctorRepository) {

        doctorRepository = theDoctorRepository;
    }

    public Doctor save(Doctor theDoctor)
    {
        System.out.println(theDoctor);
        return doctorRepository.save(theDoctor);
    }

}
