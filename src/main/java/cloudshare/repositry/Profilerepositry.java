package cloudshare.repositry;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import cloudshare.document.ProfileDocument;



public interface Profilerepositry extends MongoRepository<ProfileDocument,String> {
    Optional<ProfileDocument> findByEmail(String email);
    ProfileDocument findByClerkId(String clerkId);
   Boolean existsByClerkId(String clearkId);
    
}
