package com.kxj.ai.service;

import com.alibaba.dashscope.aigc.generation.Generation;
import com.alibaba.dashscope.aigc.generation.GenerationParam;
import com.alibaba.dashscope.aigc.generation.GenerationResult;
import com.alibaba.dashscope.common.Message;
import com.alibaba.dashscope.common.Role;
import com.alibaba.dashscope.aigc.generation.GenerationUsage;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.SocketTimeoutException;
import java.util.*;
import java.util.concurrent.TimeoutException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service
@Slf4j
public class AiService {

    @Value("${dashscope.api.key}")
    private String apiKey;

    private final Gson gson = new Gson();

    // 重构后的系统Prompt - 重点解决两个核心问题
    String systemPrompt = """
                你是一个专业的知识图谱构建AI助手，专注于高质量知识推理与结构化输出。你的核心任务是根据用户查询（如人物关系梳理、知识点梳理或特定主题分析），深入理解上下文，进行知识检索、逻辑推理和权重评估，生成精确、非冗余的知识图谱三元组。严格遵循以下规则：
                #1. 深度分析优先：
                    不进行简单文本提取或关键词匹配。必须结合领域知识、上下文语义和逻辑推理，识别核心实体、关系及重要性。
                    例如：梳理人物关系时，需分析角色动机、事件影响；梳理知识点时，需评估概念基础性、应用广度。
                    权重（SWeight 和 OWeight）必须反映节点在当前查询上下文中的相对重要性：
                    SWeight（主节点权重）：基于主节点的中心性、影响力或关键程度（0-100整数）。
                    OWeight（从节点权重）：基于从节点的依赖性、贡献度或相关性（0-100整数）。
                    示例：若"丹妮莉丝"在权力斗争中是核心，SWeight 高；若"琼恩"的保护行为是次要事件，OWeight 较低。
                #2. 输出规范：
                    仅输出一个 纯JSON数组，包含 约250个条目（允许230-300条，质量优先；内容不足时可减少，但避免低质填充）。
                    每个条目必须是是数组,顺序严格为此：["subject"(主节点名称), "relation"(关系描述), "object"(从节点名称), SWeight(整数), OWeight(整数)]。
                    subject 和 object：使用简明、标准化的名称（如"爱因斯坦"而非"著名物理学家"）。
                    relation：用动词短语描述动态关系（如"提出"、"影响"、"属于"），避免模糊词。
                    权重：整数范围0-100，需逻辑一致（如核心实体权重≥70，边缘实体≤30）。
                    绝对禁止：
                #3. 权重分配：
                    每20一个等级尽量让每个等级都有,不要全集中在50以上
                #4. 执行流程：
                    步骤1：解析用户查询，明确主题（如"三国人物关系"或"量子力学知识点"）。
                    步骤2：调度内部知识库，进行多角度推理（如事件链分析、概念层级推导）。
                    步骤3：生成三元组时：
                       关系必须体现因果/层级/交互逻辑（如"曹操"-"统帅"-"夏侯惇"而非简单"关联"）。
                    步骤4：过滤并精选约200条，检测总体题目是否符合用户要求,优先保留高信息密度条目（如避免"人物-存在-地点"类空洞三元组）,最后分配权重,满足#3,同时权重基于量化评估：高频核心节点取高值（如SWeight=90），边缘节点取低值（如OWeight=25）。
                #5.
                    禁止任何额外文本（如说明、错误信息、Markdown标记）。以及```json等格式字符；输出必须是直接可解析的JSON。重复、低相关性或推测性条目（确保每个三元组有明确依据）。
                ###示例输出（仅作参考，实际需动态生成）：
                [
                    ["琼恩","保护","丹妮莉丝",85,70],
                    ["艾莉亚","复仇目标","瓦德·佛雷",78,65]
                ]
            
                当用户查询触发时，你的响应必须仅为上述JSON数组，无任何前缀、后缀或解释。若查询不明确，生成空数组[]；若内容不足，优先保证条目质量而非数量。
            
            """;

    public List<List<Object>> getTripleData(String prompt, boolean needSearch) throws Exception {
        try {
            Generation gen = new Generation();
            Message systemMsg = Message.builder()
                    .role(Role.SYSTEM.getValue())
                    .content(systemPrompt)
                    .build();

            // 优化用户提示：更简洁明确，避免冗余
            String userContent = needSearch ?
                    "这是用户的需求\"" + prompt + "\",请你包括不限于调度自己知识库或搜索相关信息 2. 严格按系统规则提取关系三元组" :
                    "请从以下文本中严格按系统规则提取关系三元组：\n" + prompt;


            System.out.println("用户提示: "+ userContent);

            Message userMsg = Message.builder()
                    .role(Role.USER.getValue())
                    .content(userContent)
                    .build();

            // 关键变更：使用QWEN_MAX模型（处理长输出更稳定）
            GenerationParam param = GenerationParam.builder()
                    .apiKey(apiKey)
                    .model("qwen-plus") // 升级模型
                    .messages(Arrays.asList(systemMsg, userMsg))
                    .resultFormat(GenerationParam.ResultFormat.MESSAGE)
                    .topP(0.8)
                    .enableSearch(true)
                    .enableThinking(false)
                    .build();

            GenerationResult result = gen.call(param);
            GenerationUsage usage = result.getUsage();
            if (usage != null) {

                System.out.println("输入:"+usage.getInputTokens() );
                System.out.println("输出:"+usage.getOutputTokens() );
                System.out.println("总计:"+usage.getTotalTokens() );
            }

            String rawContent = result.getOutput().getChoices().getFirst().getMessage().getContent();
            System.out.println("原始AI响应: " + rawContent);

            // 两级清洗：先按规则清洗，再进行后处理校验
            String cleanedJson = cleanJsonContent(rawContent);
            System.out.println("清洗后的JSON: " + cleanedJson);

            // 解析JSON并检查是否为空数组
            List<List<Object>> parsedResult = gson.fromJson(cleanedJson, new TypeToken<List<List<Object>>>() {
            }.getType());

            // 如果解析结果为null，返回空数组
            return Objects.requireNonNullElseGet(parsedResult, ArrayList::new);

        } catch (JsonSyntaxException e) {
            throw new JsonSyntaxException("AI返回数据格式错误: " + e.getMessage(), e);
        }catch (Exception e) {
            throw new Exception("AI调用失败: " + e.getMessage(), e);
        }
    }



    /**
     * 增强版JSON清洗：处理多层嵌套问题
     */
    private String cleanJsonContent(String content) {
        if (content == null) return "[]";

        return content.trim()
                .replaceAll("(?s)^```json\\s*|\\s*```$", "")
                .replaceAll("(?s)^```\\s*|\\s*```$", "");


    }

}
