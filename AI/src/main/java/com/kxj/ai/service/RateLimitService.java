package com.kxj.ai.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class RateLimitService {

    // 核心计数器: key = "接口路径_日期", value = 调用次数
    private final Map<String, AtomicInteger> dailyCounts = new ConcurrentHashMap<>();
    // 标记是否已发送限额邮件: key = "接口路径_日期"
    private final Map<String, AtomicBoolean> limitReachedFlags = new ConcurrentHashMap<>();
    // 日期格式 (如 20240821)
    private final DateTimeFormatter formatter = DateTimeFormatter.BASIC_ISO_DATE;

    /**
     * 检查接口是否允许调用
     * @param interfacePath 接口路径
     * @param maxCallsPerDay 每日最大调用次数
     * @return 是否允许调用
     */
    public boolean isAllowed(String interfacePath, int maxCallsPerDay) {
        String dateKey = LocalDate.now().format(formatter);
        String fullKey = interfacePath + "_" + dateKey;

        // 原子递增计数
        AtomicInteger counter = dailyCounts.computeIfAbsent(fullKey, k -> new AtomicInteger(0));
        int currentCount = counter.incrementAndGet();

        // 仅判断是否超限，不修改邮件标记状态
        return currentCount <= maxCallsPerDay;
    }
    /**
     * 获取昨日统计报告
     */
    public Map<String, Integer> getYesterdayStats() {
        String yesterday = LocalDate.now().minusDays(1).format(formatter);
        return dailyCounts.entrySet().stream()
                .filter(e -> e.getKey().endsWith("_" + yesterday))
                .collect(Collectors.toMap(
                        e -> e.getKey().substring(0, e.getKey().lastIndexOf('_')),
                        e -> e.getValue().get()
                ));
    }

    /**
     * 清理昨日数据
     */
    public void cleanupYesterdayData() {
        String yesterday = LocalDate.now().minusDays(1).format(formatter);
        dailyCounts.keySet().removeIf(key -> key.endsWith("_" + yesterday));
        limitReachedFlags.keySet().removeIf(key -> key.endsWith("_" + yesterday));
    }

    /**
     * 标记并检查是否是首次达到限流 - 仅当首次超限时返回true
     */
    public boolean markLimitReached(String interfacePath) {
        String dateKey = LocalDate.now().format(formatter);
        String fullKey = interfacePath + "_" + dateKey;

        AtomicBoolean hasSent = limitReachedFlags.computeIfAbsent(
                fullKey, k -> new AtomicBoolean(false)
        );

        // 如果之前是false（未发送过），现在设置为true并返回true
        // 如果之前是true（已发送过），返回false
        return !hasSent.getAndSet(true);
    }


}
