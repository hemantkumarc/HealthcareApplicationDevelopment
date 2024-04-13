package com.drvolte.spring_server.controller;

import com.drvolte.spring_server.config.UserAuthenticationProvider;
import com.drvolte.spring_server.dao.CounsellorRepository;
import com.drvolte.spring_server.dao.SeniorDrRepository;
import com.drvolte.spring_server.dao.UserRepository;
import com.drvolte.spring_server.entity.Counsellor;
import com.drvolte.spring_server.entity.SeniorDr;
import com.drvolte.spring_server.models.EmailStructure;
import com.drvolte.spring_server.models.Roles;
import com.drvolte.spring_server.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/mail")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private CounsellorRepository counsellorRepository;

    @Autowired
    private SeniorDrRepository seniorDrRepository;

    @Autowired
    private UserAuthenticationProvider userAuthProvider;

    // Please add method level security so that only ROLE_ADMIN is authorized to use this endpoint
    @PostMapping("/send/{mailId}")
    public ResponseEntity<String> sendMail(@PathVariable String mailId){
        EmailStructure emailStructure = new EmailStructure();

        Optional<SeniorDr> seniorDoc = seniorDrRepository.findSeniorDrsByEmailOrQualificationOrSpecialization(mailId, "", "").stream().findFirst();
        Optional<Counsellor> counsellorDoc = counsellorRepository.findCounsellorsByEmailOrQualificationOrSpecialization(mailId, "", "").stream().findFirst();

        String role = "";
        String name = "";
        if (seniorDoc.isEmpty() && counsellorDoc.isEmpty()) {
            return ResponseEntity.ok("No doctor found with the given criteria !");
        } else {
            if (seniorDoc.isPresent()) {
                SeniorDr seniorDr = seniorDoc.get();
                name = seniorDr.getName();
                role = Roles.SENIORDR.toString();
            } else {
                Counsellor counsellor = counsellorDoc.get();
                name = counsellor.getName();
                role = Roles.COUNSELLOR.toString();
            }
        }
        String token = "";
        token = userAuthProvider.createTokenForEnrollDoctor(mailId, name, role);
        emailStructure.setSubject("[Dr. Volte] Register Doctor");
        emailStructure.setMessage("Please click on the following link to create password and register yourself ! \n" +
                "Use http://localhost:3000/adminSignUpDoctor?token="+ token);
        emailService.sendMail(mailId, emailStructure);
        return ResponseEntity.ok("The email was sent successfully !");
    }

//    @PostMapping("/send/{mailId}")
//    public String sendMail(@PathVariable String mailId, @RequestBody EmailStructure emailStructure){
//        emailService.sendMail(mailId, emailStructure);
//        return "Successfully sent the mail !!";
//    }


    // Please add another method for forgot password that will trigger the usage of email service which
    // will check if the given user exists in the database.
    // Also add method level security to this.

}
