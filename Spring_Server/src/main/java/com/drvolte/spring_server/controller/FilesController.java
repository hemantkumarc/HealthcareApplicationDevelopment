package com.drvolte.spring_server.controller;

import com.drvolte.spring_server.dtos.FileUploadResponseDTO;
import com.drvolte.spring_server.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/file")
public class FilesController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FileUploadResponseDTO> uploadPhoto(@RequestParam("image") MultipartFile file) throws IOException {
        return fileStorageService.uploadImage(file);
    }

    @GetMapping("/download")
    public byte[] downloadPhoto(@RequestParam("imagePath") String filePath) throws IOException
    {
        return fileStorageService.downloadImage(filePath);
    }

}
