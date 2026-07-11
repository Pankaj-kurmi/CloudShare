package cloudshare.services;

import cloudshare.DTO.FileMetadataDTO;

import cloudshare.document.FileMetaDocument;
import cloudshare.document.ProfileDocument;
import cloudshare.repositry.FileMetaDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileMetaDataService {

    private final FileMetaDataRepository fileMetaDataRepository;
    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;

    public List<FileMetadataDTO> uploadFiles(MultipartFile[] files) throws IOException {
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        List<FileMetaDocument> savedFiles = new ArrayList<>();

        if (files == null || files.length == 0) {
            return new ArrayList<>();
        }

        if (!userCreditsService.hasEnoughCredits(files.length)) {
            throw new RuntimeException("Not enough credits to upload files.");
        }

        Path uploadPath = Paths.get("upload").toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        for (MultipartFile file : files) {
            String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
            String fileName = UUID.randomUUID() + (extension != null ? "." + extension : "");

            Path targetLocation = uploadPath.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    targetLocation,
                    StandardCopyOption.REPLACE_EXISTING
            );

            FileMetaDocument fileMetadata = FileMetaDocument.builder()
                    .fileLocation(targetLocation.toString())
                    .name(file.getOriginalFilename())
                    .size(file.getSize())
                    .type(file.getContentType())
                    .clerkId(currentProfile.getClerkId())
                    .isPublic(false)
                    .uploadedAt(LocalDateTime.now())
                    .build();
            userCreditsService.consumeCredits();

            savedFiles.add(fileMetaDataRepository.save(fileMetadata));
        }

        return savedFiles.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private FileMetadataDTO mapToDTO(FileMetaDocument fileMetaDocument) {
        return FileMetadataDTO.builder()
                .fileLocation(fileMetaDocument.getFileLocation())
                .name(fileMetaDocument.getName())
                .size(fileMetaDocument.getSize())
                .type(fileMetaDocument.getType())
                .clerkId(fileMetaDocument.getClerkId())
                .isPublic(fileMetaDocument.getIsPublic())
                .uploadedAt(fileMetaDocument.getUploadedAt())
                .build();
    }
    public List<FileMetadataDTO> getFiles() {
    ProfileDocument currentProfile = profileService.getCurrentProfile();

    List<FileMetaDocument> files =
            fileMetaDataRepository.findByClerkId(currentProfile.getClerkId());

    return files.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
}
public FileMetadataDTO getPublicFile(String id) {

    Optional<FileMetaDocument> fileOptional =
            fileMetaDataRepository.findById(id);

    if (fileOptional.isEmpty() || !fileOptional.get().getIsPublic()) {
        throw new RuntimeException("Unable to get the file");
    }

    FileMetaDocument document = fileOptional.get();

    return mapToDTO(document);
}
public FileMetadataDTO getDownloadableFile(String id) {

    FileMetaDocument file = fileMetaDataRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("File not found"));

    return mapToDTO(file);
}
public void deleteFile(String id) {
    try {
        ProfileDocument currentProfile = profileService.getCurrentProfile();

        FileMetaDocument file = fileMetaDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        if (!file.getClerkId().equals(currentProfile.getClerkId())) {
            throw new RuntimeException("File is not belong to current user");
        }

        Path filePath = Paths.get(file.getFileLocation());
        Files.deleteIfExists(filePath);

        fileMetaDataRepository.deleteById(id);

    } catch (Exception e) {
        throw new RuntimeException("Error deleting the file");
    }
}
public FileMetadataDTO togglePublic(String id) {

    FileMetaDocument file = fileMetaDataRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("File not found"));

    file.setIsPublic(!file.getIsPublic());
    fileMetaDataRepository.save(file);

    return mapToDTO(file);
}
}