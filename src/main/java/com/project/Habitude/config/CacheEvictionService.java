package com.project.Habitude.config;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class CacheEvictionService {

    private final StringRedisTemplate redisTemplate;

    public void evictUserAiRecommendations(String email) {
        String pattern = "aiRecommendations::" + email + "::*";
        Set<String> keys = redisTemplate.keys(pattern);

        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
            log.info("Evicted {} AI recommendation cache keys for user: {}", keys.size(), email);
        }
    }
}
