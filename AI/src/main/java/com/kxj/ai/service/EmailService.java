package com.kxj.ai.service;

import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EmailService {

    @Resource
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}") // 自动读取配置的邮箱
    private String senderEmail;


    public void sendLimitReachedEmail(String interfacePath) {
        SimpleMailMessage message = new SimpleMailMessage();
        System.out.println("发送邮件给: " + senderEmail);
        // 关键修复：必须设置与认证账号相同的发件人
        message.setFrom(senderEmail);  // 必须与spring.mail.username相同
        message.setTo("2787901285@qq.com");
        message.setSubject("⚠️ 接口调用已达上限: " + interfacePath);
        message.setText("接口 " + interfacePath + " 已达到今日调用上限");
        mailSender.send(message);
    }

    public void sendDailyReport(Map<String, Integer> stats, String date) {
        StringBuilder content = new StringBuilder("【" + date + " 接口调用统计】\n\n");
        stats.forEach((path, count) ->
                content.append(path).append(": ").append(count).append("次\n")
        );

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderEmail);  // 必须与spring.mail.username相同
        message.setTo("admin@example.com");
        message.setSubject("📊 每日接口调用报告 - " + date);
        message.setText(content.toString());
        mailSender.send(message);
    }
}
