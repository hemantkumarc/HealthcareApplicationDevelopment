package com.drvolte.spring_server.service;

import java.io.File;
import java.io.IOException;

import com.drvolte.spring_server.dtos.FileUploadResponseDTO;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final String relativeFolderPath = "assets" + File.separator;
    @Value("${spring.servlet.multipart.max-file-size}")
    private String maxFileSize;

    public ResponseEntity<FileUploadResponseDTO> uploadImageToFileSystem(MultipartFile file) throws IOException {

        FileUploadResponseDTO fileUploadResponseDTO = null;

        try {
            if (file.getSize() > parseSize(maxFileSize))
                throw new MaxUploadSizeExceededException(parseSize(maxFileSize));

            // Get the application's current working directory
            String currentDirectory = System.getProperty("user.dir");
            // Construct the absolute path by appending the relative path
            String folderPath = currentDirectory + File.separator + relativeFolderPath;

            System.out.println("Relative folder path : " + relativeFolderPath);

            File folder = new File(folderPath);
            if (!folder.exists()) {
                // Folder does not exist. Hence, create the folder.
                boolean folderCreated = folder.mkdirs();
                if (folderCreated) {
                    System.out.println("Folder created successfully.");
                } else {
                    System.out.println("Failed to create folder.");
                }
            } else {
                // Folder exists, so don't create it.
                System.out.println("Folder already exists.");
            }

            String fileName = file.getOriginalFilename();
            String filePath = folderPath + fileName;
            file.transferTo(new File(filePath));
            fileUploadResponseDTO = FileUploadResponseDTO.builder()
                    .fileUploadStatus("Success")
                    .filePath(relativeFolderPath + fileName)
                    .build();
            return ResponseEntity.ok(fileUploadResponseDTO);
        } catch (MaxUploadSizeExceededException e) {
            fileUploadResponseDTO = FileUploadResponseDTO.builder()
                    .fileUploadStatus("Failure")
                    .filePath("")
                    .build();
            return ResponseEntity.badRequest().body(fileUploadResponseDTO);
        }
    }

    private long parseSize(String size) {
        size = size.toUpperCase();
        long parsedLong = Long.parseLong(size.substring(0, size.length() - 2));
        if (size.endsWith("KB")) {
            return parsedLong * 1024;
        } else if (size.endsWith("MB")) {
            return parsedLong * 1024 * 1024;
        } else {
            return Long.parseLong(size);
        }
    }
}
