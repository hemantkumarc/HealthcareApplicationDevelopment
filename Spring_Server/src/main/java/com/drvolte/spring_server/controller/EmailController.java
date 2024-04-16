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
import com.drvolte.spring_server.exceptions.AppException;
import com.drvolte.spring_server.models.ChangePasswordStructure;
import com.drvolte.spring_server.models.EmailStructure;
import com.drvolte.spring_server.models.Roles;
import com.drvolte.spring_server.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
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

    @PostMapping("/send/{mailId}")
    public ResponseEntity<String> sendMail(@PathVariable String mailId){
        EmailStructure emailStructure = new EmailStructure();

        Optional<SeniorDr> seniorDoc = seniorDrRepository.findSeniorDrsByEmailOrQualificationOrSpecialization(mailId, "", "").stream().findFirst();
        Optional<Counsellor> counsellorDoc = counsellorRepository.findCounsellorsByEmailOrQualificationOrSpecialization(mailId, "", "").stream().findFirst();

        String role = "";
        String name = "";
        String doctor_status = "";
        if (seniorDoc.isEmpty() && counsellorDoc.isEmpty()) {
            return ResponseEntity.ok("No doctor found with the given criteria !");
        } else {
            if (seniorDoc.isPresent()) {
                SeniorDr seniorDr = seniorDoc.get();
                name = seniorDr.getName();
                role = Roles.ROLE_SENIORDR.toString();
                doctor_status = seniorDr.getStatus();
            } else {
                Counsellor counsellor = counsellorDoc.get();
                name = counsellor.getName();
                role = Roles.ROLE_COUNSELLOR.toString();
                doctor_status = counsellor.getStatus();
            }
        }
        if(doctor_status.equals("enabled"))
        {
            // Doctor is enabled => Doctor is present in the Users table => Allow Doctor to reset his password !
            String token = "";
            token = userAuthProvider.createTokenForEnrollDoctor(mailId, name, role);
            emailStructure.setSubject("[Dr. Volte] Register Doctor");
            emailStructure.setMessage("Please click on the following link to create password and register yourself ! \n" +
                    "\nUse http://localhost:3000/adminSignUpDoctor?token="+ token + "" +
                    "\n\nRegards, \n Admin @ DrVolte");
            emailService.sendMail(mailId, emailStructure);
        }
        return ResponseEntity.ok("The email was sent successfully !");
    }

    @PostMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordStructure passwordStructure) {
        String password = passwordStructure.getPassword();
        String token = passwordStructure.getToken();
        try {
            DecodedJWT decodedJWT = userAuthProvider.getDecoded(token);
            String name = decodedJWT.getClaim("name").asString();
            String email = decodedJWT.getClaim("email").asString();
            String role = decodedJWT.getClaim("role").asString();

            Optional<User> user = userRepository.findByUsername(email);
            if (user.isPresent()) {
                // The required user was found in the database
                User oldUser = user.get();
                oldUser.setPassword(password);
                userRepository.save(oldUser);
            } else {
                // User was not found, so we have to create a new user.
                User newDoctor = new User();
                newDoctor.setName(name);
                newDoctor.setEnable(true);
                newDoctor.setPassword(password);
                newDoctor.setRole(Roles.valueOf(role));
                newDoctor.setUsername(email);
                userRepository.save(newDoctor);
            }
        } catch (JWTVerificationException e) {
            System.out.println("Token has expired !" + e);
        }
        return ResponseEntity.ok("Password changed successfully !");
    }
}
