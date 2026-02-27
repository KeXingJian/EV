package com.kxj.ai.interceptor;

import com.kxj.ai.event.LimitReachedEvent;
import com.kxj.ai.service.RateLimitService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {


    @Resource
    private RateLimitService rateLimitService;

    @Resource
    private ApplicationEventPublisher eventPublisher;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String interfacePath = "ai";
        int maxCallsPerDay = 20; // 可配置化

        if (!rateLimitService.isAllowed(interfacePath, maxCallsPerDay)) {
            // 仅当首次超限时触发事件
            if (rateLimitService.markLimitReached(interfacePath)) {
                System.out.println("触发限流事件");
                eventPublisher.publishEvent(new LimitReachedEvent(this, interfacePath));
            }
            response.setStatus(429);
            return false;
        }
        return true;
    }
}
