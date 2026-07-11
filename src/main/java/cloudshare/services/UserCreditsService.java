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
    return userCreditsRepositry.save(userCredits);
}
public UserCredits getUserCredits(String clerkId) {
    return userCreditsRepositry.findAll().stream()
            .filter(userCredits -> clerkId.equals(userCredits.getClerkId()))
            .findFirst()
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
        return null;
    }

    userCredits.setCredits(userCredits.getCredits() - 1);

    return userCreditsRepositry.save(userCredits);
}
}
