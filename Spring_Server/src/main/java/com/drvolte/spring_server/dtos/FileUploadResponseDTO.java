package com.drvolte.spring_server.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FileUploadResponseDTO {
    private String fileUploadStatus;
    private String filePath;
}
