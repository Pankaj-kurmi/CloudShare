package cloudshare.com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(scanBasePackages = "cloudshare")
@EnableMongoRepositories(basePackages = "cloudshare.repositry")
public class CloudshareApplication {

	public static void main(String[] args) {
		SpringApplication.run(CloudshareApplication.class, args);
	}

}
