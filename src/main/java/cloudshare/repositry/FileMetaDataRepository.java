package cloudshare.repositry;

import org.springframework.data.mongodb.repository.MongoRepository;

import cloudshare.document.FileMetaDocument;
import java.util.List;


public interface FileMetaDataRepository extends MongoRepository<FileMetaDocument,String>{
    List<FileMetaDocument> findByClerkId(String clerkId);
    Long countByClerkId(String clerkId);
    
}
