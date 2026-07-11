package cloudshare.repositry;

import org.springframework.data.mongodb.repository.MongoRepository;



import cloudshare.document.UserCredits;

public interface UserCreditsRepositry extends MongoRepository<UserCredits,String> {
    
}
