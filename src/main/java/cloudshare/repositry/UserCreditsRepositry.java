package cloudshare.repositry;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;



import cloudshare.document.UserCredits;

public interface UserCreditsRepositry extends MongoRepository<UserCredits,String> {
	Optional<UserCredits> findByClerkId(String clerkId);
}
