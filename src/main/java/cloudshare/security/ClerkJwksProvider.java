package cloudshare.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.net.URL;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ClerkJwksProvider {

    @Value("${clerk.jwks-url}")
    private String jwksUrl;

    private final Map<String, PublicKey> keyCache = new ConcurrentHashMap<>();
    private volatile long lastFetchTime = 0;
    private static final long CACHE_TTL = 3600000; // 1 hour

    public PublicKey getPublicKey(String kid) throws Exception {
        if (keyCache.containsKey(kid) &&
                System.currentTimeMillis() - lastFetchTime < CACHE_TTL) {
            return keyCache.get(kid);
        }

        refreshKeys();
        return keyCache.get(kid);
    }

    private synchronized void refreshKeys() throws Exception {
        // Double-check inside synchronized block
        if (System.currentTimeMillis() - lastFetchTime < CACHE_TTL && !keyCache.isEmpty()) {
            return;
        }

        ObjectMapper mapper = new ObjectMapper();
        JsonNode jwks = mapper.readTree(new URL(jwksUrl));
        JsonNode keys = jwks.get("keys");

        if (keys == null || !keys.isArray()) {
            throw new IllegalStateException("Invalid JWKS response: missing 'keys' array");
        }

        for (JsonNode keyNode : keys) {
            String kid = keyNode.path("kid").asText(null);
            String kty = keyNode.path("kty").asText(null);
            String alg = keyNode.path("alg").asText(null);

            if (kid != null && "RSA".equals(kty) && "RS256".equals(alg)) {
                String n = keyNode.path("n").asText();
                String e = keyNode.path("e").asText();

                PublicKey publicKey = createPublicKey(n, e);
                keyCache.put(kid, publicKey);
            }
        }

        lastFetchTime = System.currentTimeMillis();
    }

    private PublicKey createPublicKey(String modulus, String exponent) throws Exception {
        byte[] modulusBytes = Base64.getUrlDecoder().decode(modulus);
        byte[] exponentBytes = Base64.getUrlDecoder().decode(exponent);

        BigInteger modulusBigInt = new BigInteger(1, modulusBytes);
        BigInteger exponentBigInt = new BigInteger(1, exponentBytes);

        RSAPublicKeySpec spec = new RSAPublicKeySpec(modulusBigInt, exponentBigInt);
        KeyFactory factory = KeyFactory.getInstance("RSA");

        return factory.generatePublic(spec);
    }
}