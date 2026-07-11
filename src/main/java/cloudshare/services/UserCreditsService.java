package cloudshare.services;

import org.springframework.stereotype.Service;

import cloudshare.document.UserCredits;
import cloudshare.repositry.UserCreditsRepositry;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserCreditsService {
    private final UserCreditsRepositry userCreditsRepositry;
    private final ProfileService profileService;
    public UserCredits createInitialCredits(String clerkId) {

    UserCredits userCredits = UserCredits.builder()
            .clerkId(clerkId)
            .credits(15)
            .plan("BASIC")
            .build();
        UserCredits savedCredits = userCreditsRepositry.save(userCredits);
        profileService.updateCurrentProfileCredits(clerkId, savedCredits.getCredits());
        return savedCredits;
}
public UserCredits getUserCredits(String clerkId) {
        return userCreditsRepositry.findByClerkId(clerkId)
            .orElseGet(() -> createInitialCredits(clerkId));
}

public UserCredits getUserCredits() {
    String clerkId = profileService.getCurrentProfile().getClerkId();
    return getUserCredits(clerkId);
}
public Boolean hasEnoughCredits(int requiredCredits) {
    UserCredits userCredits = getUserCredits();
    return userCredits.getCredits() >= requiredCredits;
}
public UserCredits consumeCredits() {
    UserCredits userCredits = getUserCredits();

    if (userCredits.getCredits() <= 0) {
        throw new IllegalStateException("No credits available");
    }

    userCredits.setCredits(userCredits.getCredits() - 1);
    UserCredits savedCredits = userCreditsRepositry.save(userCredits);
    profileService.updateCurrentProfileCredits(savedCredits.getClerkId(), savedCredits.getCredits());
    return savedCredits;
}

public UserCredits addCredits(String clerkId, int creditsToAdd) {
    if (creditsToAdd <= 0) {
        throw new IllegalArgumentException("Credits to add must be greater than zero");
    }

    UserCredits userCredits = getUserCredits(clerkId);
    userCredits.setCredits(userCredits.getCredits() + creditsToAdd);
    UserCredits savedCredits = userCreditsRepositry.save(userCredits);
    profileService.updateCurrentProfileCredits(clerkId, savedCredits.getCredits());
    return savedCredits;
}
}
