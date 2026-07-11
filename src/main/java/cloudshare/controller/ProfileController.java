package cloudshare.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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

    @GetMapping("/profile/me")
    public ResponseEntity<ProfileDTO> getCurrentProfile() {
        return ResponseEntity.ok(profileService.getCurrentProfileDto());
    }

    @PatchMapping(path = "/profile/me", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProfileDTO> updateCurrentProfile(@RequestBody ProfileDTO profileDTO) {
        return ResponseEntity.ok(profileService.updateCurrentProfile(profileDTO));
    }

    @GetMapping("/profile/credits")
    public ResponseEntity<Integer> getCurrentCredits() {
        return ResponseEntity.ok(profileService.getCurrentProfile().getCredits());
    }

    @DeleteMapping("/profile/me")
    public ResponseEntity<Void> deleteCurrentProfile() {
        profileService.deleteProfile(profileService.getCurrentProfile().getClerkId());
        return ResponseEntity.noContent().build();
    }
}
