package com.drvolte.spring_server.controller;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.drvolte.spring_server.config.UserAuthenticationProvider;
import com.drvolte.spring_server.dao.CounsellorRepository;
import com.drvolte.spring_server.dao.SeniorDrRepository;
import com.drvolte.spring_server.dao.UserRepository;
import com.drvolte.spring_server.entity.Counsellor;
import com.drvolte.spring_server.entity.SeniorDr;
import com.drvolte.spring_server.entity.User;
import com.drvolte.spring_server.models.ChangePasswordStructure;
import com.drvolte.spring_server.models.EmailStructure;
import com.drvolte.spring_server.models.Roles;
import com.drvolte.spring_server.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @Autowired
    private UserRepository userRepository;

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
                role = Roles.ROLE_SENIORDR.toString();
            } else {
                Counsellor counsellor = counsellorDoc.get();
                name = counsellor.getName();
                role = Roles.ROLE_COUNSELLOR.toString();
            }
        }
        String token = "";
        token = userAuthProvider.createTokenForEnrollDoctor(mailId, name, role);
        emailStructure.setSubject("[Dr. Volte] Register Doctor");
        emailStructure.setMessage("Please click on the following link to create password and register yourself ! \n" +
                "Use http://localhost:3000/adminSignUpDoctor?token="+ token + "" +
                "\n\nRegards, \n Admin @ DrVolte");
        emailService.sendMail(mailId, emailStructure);
        return ResponseEntity.ok("The email was sent successfully !");
    }

    @PostMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordStructure passwordStructure)
    {
        String password = passwordStructure.getPassword();
        String token = passwordStructure.getToken();
        try {
            DecodedJWT decodedJWT = userAuthProvider.getDecoded(token);
            String name = decodedJWT.getClaim("name").asString();
            String email = decodedJWT.getClaim("email").asString();
            String role = decodedJWT.getClaim("role").asString();

            User newDoctor = new User();
            newDoctor.setName(name);
            newDoctor.setEnable(true);
            newDoctor.setPassword(password);
            newDoctor.setRole(Roles.valueOf(role));
            newDoctor.setUsername(email);
            userRepository.save(newDoctor);
        }
        catch (JWTVerificationException e) {
            System.out.println("Toke has expired !" + e);
        }
        return ResponseEntity.ok("Password changed successfully !");
    }


    // Please add another method for forgot password that will trigger the usage of email service which
    // will check if the given user exists in the database.
    // Also add method level security to this.

}
