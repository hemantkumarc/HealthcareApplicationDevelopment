package com.drvolte.spring_server.controller;

import com.drvolte.spring_server.models.EmailStructure;
import com.drvolte.spring_server.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mail")
public class EmailController {

    @Autowired
    private EmailService emailService;


    // Please add method level security so that only ROLE_ADMIN is authorized to use this endpoint
    @PostMapping("/send/{mailId}")
    public String sendMail(@PathVariable String mailId){
        EmailStructure emailStructure = new EmailStructure();
        emailStructure.setSubject("[Dr. Volte] Register Doctor");
        emailStructure.setMessage("Please click on the following link to create password and register yourself !");
        emailService.sendMail(mailId, emailStructure);
        return "Successfully sent the mail !!";
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
