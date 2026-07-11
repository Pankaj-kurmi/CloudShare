package cloudshare.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import cloudshare.DTO.ProfileDTO;
import cloudshare.services.ProfileService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @PostMapping(path = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> registerProfileJson(@RequestBody ProfileDTO profileDTO) {
        return registerProfile(profileDTO);
    }

    @PostMapping(path = "/register", consumes = {
            MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            MediaType.MULTIPART_FORM_DATA_VALUE
    })
    public ResponseEntity<?> registerProfileForm(ProfileDTO profileDTO) {
        return registerProfile(profileDTO);
    }

    private ResponseEntity<?> registerProfile(ProfileDTO profileDTO) {
        ProfileDTO savedProfile = profileService.createprofile(profileDTO);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedProfile);
    }
}
