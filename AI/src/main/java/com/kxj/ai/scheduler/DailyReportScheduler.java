package com.kxj.ai.scheduler;

import com.kxj.ai.service.EmailService;
import com.kxj.ai.service.RateLimitService;
import jakarta.annotation.Resource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Component
public class DailyReportScheduler {
    @Resource
    private RateLimitService rateLimitService;

    @Resource
    private EmailService emailService;

    // 每天0点0分1秒执行（避免刚好0点时的时区问题）
    @Scheduled(cron = "1 0 0 * * ?")
    public void sendDailyReport() {
        Map<String, Integer> yesterdayStats = rateLimitService.getYesterdayStats();
        String yesterday = LocalDate.now().minusDays(1).format(DateTimeFormatter.BASIC_ISO_DATE);

        emailService.sendDailyReport(yesterdayStats, yesterday);
        rateLimitService.cleanupYesterdayData();
    }
}
