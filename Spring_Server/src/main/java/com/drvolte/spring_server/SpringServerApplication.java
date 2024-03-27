package com.drvolte.spring_server;

import org.apache.catalina.connector.Connector;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SpringServerApplication {

    @Value("${http.port}")
    private int httpPort;

    public static void main(String[] args) {

        if (args.length == 2) {

            // Extract MySQL username and password from command line arguments
            String username = args[0];
            String password = args[1];

            // Set MySQL username and password as system properties
            System.setProperty("spring.datasource.username", username);
            System.setProperty("spring.datasource.password", password);
            
        } else {
            System.out.println("Usage: java -jar application.jar <mysql_username> <mysql_password>");
        }

        SpringApplication.run(SpringServerApplication.class, args);
    }

    @Bean
    public ServletWebServerFactory servletContainer() {
        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory();
        tomcat.addAdditionalTomcatConnectors(createStandardConnector());
        return tomcat;
    }

    private Connector createStandardConnector() {
        Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
        connector.setPort(httpPort);
        return connector;
    }
}