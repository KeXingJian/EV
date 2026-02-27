package com.kxj.ai.controller;

import com.kxj.ai.service.AiService;
import com.kxj.ai.common.Result;
import com.kxj.ai.service.StructuredDataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
public class AiController {

    private final AiService aiService;

    private final StructuredDataService structuredDataService;

    private final JavaMailSender mailSender;

    @GetMapping("/test")
    public String test() {
        return "Hello World!";
    }

    @Value("${spring.mail.username}") // 自动读取配置的邮箱
    private String senderEmail;

    @GetMapping("/test-email")
    public String testEmail() {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo("2787901285@qq.com");
            message.setSubject("测试邮件");
            message.setText("Spring Boot邮件配置成功！");
            mailSender.send(message);
            return "邮件发送成功";
        } catch (Exception e) {
            return "发送失败: " + e.getMessage();
        }
    }

    @PostMapping("/getTripleData")
    public Result<List<List<Object>>> getTripleData(@RequestBody String prompt) {

        try {
            long start = System.currentTimeMillis();
            List<List<Object>> result = aiService.getTripleData(prompt, true);

            // 检查结果是否为空数组
            if (result == null || result.isEmpty()) {
                return Result.error(201, "AI returned empty result");
            }

            System.out.println("调用AI接口结束，耗时：" + (System.currentTimeMillis() - start) + " ms");
            return Result.success(result);
        } catch (com.google.gson.JsonSyntaxException e) {
            log.error("JSON解析失败", e);
            return Result.error(500, "JSON解析失败: " + e.getMessage());
        } catch (java.util.concurrent.TimeoutException e) {
            log.error("AI调用超时", e);
            return Result.error(504, "AI调用超时: " + e.getMessage());
        } catch (Exception e) {
            log.error("AI处理失败", e);
            return Result.error(500, "AI处理失败: " + e.getMessage());
        }

    }

    // 修改: 支持文件上传处理
    @PostMapping("/getTripleDataByText")
    public Result<List<List<Object>>> getTripleDataByText(@RequestParam("file") MultipartFile file,
                                                          @RequestParam(value = "prompt", required = false) String prompt) {
        try {
            // 读取文件内容
            String text = new String(file.getBytes());

            // 如果提供了prompt，则将其与文件内容结合
            String content = text;
            if (prompt != null && !prompt.trim().isEmpty()) {
                content = "用户需求: " + prompt + "\n\n文件内容:\n" + text;
            }

            List<List<Object>> result = aiService.getTripleData(content, false);

            // 检查结果是否为空数组
            if (result == null || result.isEmpty()) {
                return Result.error(201, "AI returned empty result");
            }

            return Result.success(result);
        } catch (com.google.gson.JsonSyntaxException e) {
            log.error("JSON解析失败", e);
            return Result.error(500, "JSON解析失败: " + e.getMessage());
        } catch (java.net.SocketTimeoutException e) {
            log.error("AI调用超时", e);
            return Result.error(504, "AI调用超时: " + e.getMessage());
        } catch (Exception e) {
            log.error("AI处理失败", e);
            return Result.error(500, "AI处理失败: " + e.getMessage());
        }
    }

    @PostMapping("/getStructuredData")
    public Result<List<List<Object>>> getStructuredData(@RequestBody String prompt) {
        try {
            long start = System.currentTimeMillis();
            List<List<Object>> result = structuredDataService.getStructuredData(prompt, true);

            // 检查结果是否为空数组
            if (result == null || result.isEmpty()) {
                return Result.error(201, "AI returned empty result");
            }

            System.out.println("调用AI接口结束，耗时：" + (System.currentTimeMillis() - start) + " ms");
            return Result.success(result);
        } catch (com.google.gson.JsonSyntaxException e) {
            log.error("JSON解析失败", e);
            return Result.error(500, "JSON解析失败: " + e.getMessage());
        } catch (java.util.concurrent.TimeoutException e) {
            log.error("AI调用超时", e);
            return Result.error(504, "AI调用超时: " + e.getMessage());
        } catch (Exception e) {
            log.error("AI处理失败", e);
            return Result.error(500, "AI处理失败: " + e.getMessage());
        }

    }


    @PostMapping("/getStructuredDataByText")
    public Result<List<List<Object>>> getStructuredDataByText(@RequestParam("file") MultipartFile file,
                                                          @RequestParam(value = "prompt", required = false) String prompt) {
        try {
            // 读取文件内容
            String text = new String(file.getBytes());

            // 如果提供了prompt，则将其与文件内容结合
            String content = text;
            if (prompt != null && !prompt.trim().isEmpty()) {
                content = "用户需求: " + prompt + "\n\n文件内容:\n" + text;
            }

            List<List<Object>> result = structuredDataService.getStructuredData(content, false);

            // 检查结果是否为空数组
            if (result == null || result.isEmpty()) {
                return Result.error(201, "AI returned empty result");
            }

            return Result.success(result);
        } catch (com.google.gson.JsonSyntaxException e) {
            log.error("JSON解析失败", e);
            return Result.error(500, "JSON解析失败: " + e.getMessage());
        } catch (java.net.SocketTimeoutException e) {
            log.error("AI调用超时", e);
            return Result.error(504, "AI调用超时: " + e.getMessage());
        } catch (Exception e) {
            log.error("AI处理失败", e);
            return Result.error(500, "AI处理失败: " + e.getMessage());
        }
    }
}
