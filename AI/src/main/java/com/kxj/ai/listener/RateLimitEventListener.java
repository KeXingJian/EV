package com.kxj.ai.listener;

import com.kxj.ai.event.LimitReachedEvent;
import com.kxj.ai.service.EmailService;
import jakarta.annotation.Resource;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;


@Component
public class RateLimitEventListener {

    @Resource
    private EmailService emailService;

    @EventListener
    public void handleLimitReached(LimitReachedEvent event) {
        emailService.sendLimitReachedEmail(event.getInterfacePath());
    }
}
