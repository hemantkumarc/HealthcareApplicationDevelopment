package com.drvolte.spring_server.service;

import com.drvolte.spring_server.models.EmailStructure;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Value("$(spring.mail.username)")
    private String fromEmailId;

    public void sendMail(String emailId, EmailStructure emailStructure)
    {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromEmailId);
        mailMessage.setSubject(emailStructure.getSubject());
        mailMessage.setText(emailStructure.getMessage());
        mailMessage.setTo(emailId);

        emailSender.send(mailMessage);
    }
}
