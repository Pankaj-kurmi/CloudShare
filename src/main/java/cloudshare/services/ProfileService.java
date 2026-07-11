package cloudshare.services;

import java.time.Instant;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import cloudshare.DTO.ProfileDTO;
import cloudshare.document.ProfileDocument;
import cloudshare.repositry.Profilerepositry;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final Profilerepositry profilerepositry;
    public ProfileDTO createprofile(ProfileDTO profileDTO){
         if (profilerepositry.existsByClerkId(profileDTO.getClerkId())) {
           return updateProfile(profileDTO);
         }



        ProfileDocument profile = ProfileDocument.builder()
        .clerkId(profileDTO.getClerkId())
        .email(profileDTO.getEmail())
        .firstName(profileDTO.getFirstName())
        .lastName(profileDTO.getLastName())
        .photoUrl(profileDTO.getPhotoUrl())
        .credits(15)
        .createdAt(Instant.now())
        .build();

       profile= profilerepositry.save(profile);

       return ProfileDTO.builder()
        .id(profile.getId())
        .clerkId(profile.getClerkId())
        .email(profile.getEmail())
        .firstName(profile.getFirstName())
        .lastName(profile.getLastName())
        .photoUrl(profile.getPhotoUrl())
        .credits(profile.getCredits())
        .createdAt(profile.getCreatedAt())
        .build();
        
    }
    public ProfileDTO getCurrentProfileDto() {
        ProfileDocument profile = getCurrentProfile();

        return ProfileDTO.builder()
                .id(profile.getId())
                .clerkId(profile.getClerkId())
                .email(profile.getEmail())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .photoUrl(profile.getPhotoUrl())
                .credits(profile.getCredits())
                .createdAt(profile.getCreatedAt())
                .build();
    }
    public ProfileDTO updateProfile(ProfileDTO profileDTO){
    ProfileDocument existingProfile =
    profilerepositry.findByClerkId(profileDTO.getClerkId());

    if (existingProfile != null) {

    // update fields if provided
    if (profileDTO.getEmail() != null &&
        !profileDTO.getEmail().isEmpty()) {
        existingProfile.setEmail(profileDTO.getEmail());
    }

    if (profileDTO.getFirstName() != null &&
        !profileDTO.getFirstName().isEmpty()) {
        existingProfile.setFirstName(profileDTO.getFirstName());
    }
    
    if (profileDTO.getLastName() != null &&
        !profileDTO.getLastName().isEmpty()) {
        existingProfile.setLastName(profileDTO.getLastName());
    }
    
    if (profileDTO.getPhotoUrl() != null &&
        !profileDTO.getPhotoUrl().isEmpty()) {
        existingProfile.setPhotoUrl(profileDTO.getPhotoUrl());
    }
    profilerepositry.save(existingProfile);
   return ProfileDTO.builder()
    .id(existingProfile.getId())
    .email(existingProfile.getEmail())
    .clerkId(existingProfile.getClerkId())
    .firstName(existingProfile.getFirstName())
    .lastName(existingProfile.getLastName())
    .credits(existingProfile.getCredits())
    .createdAt(existingProfile.getCreatedAt())
    .photoUrl(existingProfile.getPhotoUrl())
    .build();
    
} 
return null;
    }
    public ProfileDTO updateCurrentProfile(ProfileDTO profileDTO) {
        ProfileDocument currentProfile = getCurrentProfile();
        profileDTO.setClerkId(currentProfile.getClerkId());
        return updateProfile(profileDTO);
    }
    public void deleteProfile(String clerkId) {
    ProfileDocument existingProfile = profilerepositry.findByClerkId(clerkId);

    if (existingProfile != null) {
        profilerepositry.delete(existingProfile);
    }
}
public ProfileDocument getCurrentProfile() {
    if (SecurityContextHolder.getContext().getAuthentication() == null) {
        throw new UsernameNotFoundException("User not authenticated");
    }

    String clerkId = SecurityContextHolder.getContext()
            .getAuthentication()
            .getName();

    ProfileDocument profile = profilerepositry.findByClerkId(clerkId);

    if (profile == null) {
        throw new UsernameNotFoundException("Profile not found for current user");
    }

    return profile;
}

    public void updateCurrentProfileCredits(String clerkId, int credits) {
        ProfileDocument existingProfile = profilerepositry.findByClerkId(clerkId);

        if (existingProfile == null) {
            throw new UsernameNotFoundException("Profile not found for current user");
        }

        existingProfile.setCredits(credits);
        profilerepositry.save(existingProfile);
    }
    
}
