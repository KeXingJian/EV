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

import java.util.*;


@Service
@Slf4j
public class StructuredDataService {

    @Value("${dashscope.api.key}")
    private String apiKey;

    private final Gson gson = new Gson();

    // 系统Prompt - 专门用于生成结构化二维数组数据
    String systemPrompt = """
                你是一个专业的结构化数据生成AI助手，专注于将用户查询转换为规范的二维数组格式。你的核心任务是理解用户需求，生成准确、一致的结构化数据。
                
                #1. 理解用户查询：
                    分析用户问题，确定需要生成的数据类型（包括不限于,如天气、股票、销售数据等）和维度（如时间、数值等）。
                    
                #2. 输出规范：
                    仅输出一个纯JSON二维数组，满足以下要求：
                    - 第一行为表头数组，包含属性名称（字符串类型）
                    - 从第二行开始为数据行，每行数据长度必须与表头一致
                    - 第一列通常为分类或时间标识（字符串类型）
                    - 其余列必须为数值类型（整数或小数）
                    - 至少包含表头行和两行数据
                    - 至少包含两列（一个标识列和一个数值列）
                    
                #3. 数据一致性要求：
                    - 每行数据长度必须完全一致
                    - 除了第一行表头和第一列为字符串外，其余数据必须为数值
                    - 禁止输出任何额外文本、说明或格式标记
                    
                #4. 执行流程：
                    步骤1：解析用户查询，明确所需数据类型和维度
                    步骤2：调度内部知识库或搜索引擎获取相关数据
                    步骤3：组织数据为规范的二维数组格式
                    步骤4：验证数据格式一致性，确保每行长度相等
                    步骤5：返回结果，严格遵守输出规范
                
                #5. 直接输出json
                    禁止任何额外文本（如说明、错误信息、Markdown标记）。以及```json等格式字符；输出必须是直接可解析的JSON。
                    
                ###示例输出格式：
                1)
                  [
                    ["时间","温度"],
                    ["0:00", 23],
                    ["1:00", 21]
                  ]
                
                2)
                  [
                    ["时间","降雨量","温度"],
                    ["0:00", 100, 23],
                    ["1:00", 200, 21]
                  ]
                3)
                  [
                    ["国家","2023","2023","2035"],
                    ["中国", 100, 119 , 196],
                    ["美国", 220, 300 , 545],
                    ["俄罗斯", 112, 212, 300],
                  ] 
                ###错误示例：
                 1)
                   [
                    ["时间","温度"], 
                    ["0:00", 100 ,23],//长度不一致 
                    ["1:00", 21] 
                   ]
                 2)
                    [
                    ["时间","温度" , "天气" ], 
                    ["0:00", 100 , "多云"],
                    ["1:00", 21  , "小雨"] //只允许第一行,和第一列为字符串,其余为数字 
                   ]
                
                数据质量和一致性优先于数量，确保每条数据都有明确依据。
            当用户查询触发时，你的响应必须仅为上述JSON数组，无任何前缀、后缀或解释。
                若查询不明确或无法生成结构化数据，生成空数组[]。
                你必须严格遵守以下规则：
                1. 仅输出纯JSON格式的二维数组，禁止任何额外文本、解释或标记
                2. 数据不足或查询不明确时，必须返回空数组：[]
                3. 输出必须是可直接解析的JSON，无任何前缀或后缀
                4. 示例：当无数据时→[]，而非"无法提供数据，因为..."
            """;

    public List<List<Object>> getStructuredData(String prompt, boolean needSearch) throws Exception {
        try {
            Generation gen = new Generation();
            Message systemMsg = Message.builder()
                    .role(Role.SYSTEM.getValue())
                    .content(systemPrompt)
                    .build();

            // 优化用户提示：更简洁明确，避免冗余
            String userContent = needSearch ?
                    "这是用户的需求\"" + prompt + "\",请你调度自己知识库或搜索相关信息，严格按系统规则生成结构化二维数组数据" :
                    "请从以下文本中严格按系统规则提取或生成结构化二维数组数据：\n" + prompt;


            System.out.println("用户提示: "+ userContent);

            Message userMsg = Message.builder()
                    .role(Role.USER.getValue())
                    .content(userContent)
                    .build();

            // 使用QWEN_PLUS模型
            GenerationParam param = GenerationParam.builder()
                    .apiKey(apiKey)
                    .model("qwen-max") // 使用plus模型
                    .messages(Arrays.asList(systemMsg, userMsg))
                    .resultFormat(GenerationParam.ResultFormat.MESSAGE)
                    .topP(0.8)
                    .temperature(0.7f)
                    .enableSearch(true) // 根据参数决定是否启用搜索
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

            // 清洗JSON内容
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
     * JSON清洗：处理可能的格式问题
     */
    private String cleanJsonContent(String content) {
        if (content == null) return "[]";

        return content.trim()
                .replaceAll("(?s)^```json\\s*|\\s*```$", "")
                .replaceAll("(?s)^```\\s*|\\s*```$", "");


    }

}
