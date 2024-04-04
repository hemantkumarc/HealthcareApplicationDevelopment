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

    @PostMapping("/send/{mailId}")
    public String sendMail(@PathVariable String mailId, @RequestBody EmailStructure emailStructure){
        emailService.sendMail(mailId, emailStructure);
        return "Successfully sent the mail !!";
    }

}
