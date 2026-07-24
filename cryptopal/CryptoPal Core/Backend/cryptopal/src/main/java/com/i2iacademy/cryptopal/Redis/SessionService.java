package com.i2iacademy.cryptopal.Redis;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/*Token üretme rediese yazma
* tokendan session bilgisini okuma
*/
@Service
public class SessionService {
    private final RedisTemplate<String, Object> redisTemplate;
    private static final long TOKEN_TTL=30;//30 minutes of session duration

    public SessionService(RedisTemplate<String,Object> redisTemplate){
        this.redisTemplate=redisTemplate;
    }

    public String generateAndStoreToken(SessionData user){
        String token =UUID.randomUUID().toString();
        String redisKey="auth:token:"+token;

        /*store in redis with the 30 min of TTL */
        redisTemplate.opsForValue().set(redisKey, user, TOKEN_TTL, TimeUnit.MINUTES);

        return token;
    }


}
