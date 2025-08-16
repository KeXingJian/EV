<template>
  <div class="floating-ai-button">
    <div class="button-wrapper">
      <div v-if="expanded" class="chat-container">
        <div class="chat-header">AI助手</div>
        <div class="chat-messages">
          <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.type]">
            {{ msg.text }}
          </div>
        </div>
        <div class="chat-input">
          <!-- 添加 :disabled="isLoading" 禁用输入框 -->
          <input
              ref="inputRef"
              v-model="inputText"
              :disabled="isLoading"
              placeholder="输入消息..."
              @keyup.enter="sendMessage"
              v-if="!isLoading"
          />
          <input
              placeholder="正在处理..."
              :disabled="true"
              v-else
          />
          <button
              @click="sendMessage"
              :disabled="isLoading || !inputText.trim()"
              :class="{ 'loading': isLoading }"
          >
            <span >发送</span>
          </button>
        </div>

      </div>
      <!-- 仅按钮区域可拖拽 -->
      <button
          class="ai-button"
          @click="toggleChat"
          :class="{ 'loading': isLoading && expanded }"
      >
        <svg v-if="!expanded" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H7v-2h10v2zm0-3H7V9h10v2zm0-3H7V6h10v2z"/>
        </svg>
        <span v-else>×</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { getTripleData } from "../../api/EVsApi.js";
import {v4 as uuidv4} from "uuid";
import {analyzeColumns2} from "../../utils/ExcelUtils.js";
import {useOptionConfig} from "../../store/OptionConfig.js";
import {storeToRefs} from "pinia";

const {
  fileData,
  dataset,
  Ss,Cs,addRelation2,
  echartsOptions
} = useOptionConfig()

// 组件状态
const expanded = ref(false);
const inputText = ref('');
const messages = ref([
  { text: '你好！我可帮你检索并抽取信息,从而快速构建关系图', type: 'ai' }
]);
const inputRef = ref();
// 新增：加载状态
const isLoading = ref(false);
// 新增：用于存储"正在处理"消息的索引
let processingMessageIndex = null;

// 切换聊天窗口
const toggleChat = () => {
  expanded.value = !expanded.value;

  // 聊天窗口打开时自动聚焦输入框
  if (expanded.value) {
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
};

// 发送消息
const sendMessage = () => {
  // 新增：检查加载状态
  if (isLoading.value || !inputText.value.trim()) return;

  // 设置加载状态
  isLoading.value = true;

  const userMessage = inputText.value.trim();

  // 添加用户消息
  messages.value.push({
    text: userMessage,
    type: 'user'
  });

  // 添加AI的"正在处理"消息，并记录索引
  messages.value.push({
    text: '正在为您处理,请稍等',
    type: 'ai'
  });
  processingMessageIndex = messages.value.length - 1;

  // 清空输入框
  inputText.value = '';
  scrollToBottom();

  // 发送API请求
  getTripleData(userMessage)
      .then((response) => {
        // 移除"正在处理"消息
        if (processingMessageIndex !== null) {
          messages.value.splice(processingMessageIndex, 1);
          processingMessageIndex = null;
        }


        // 根据响应生成结果消息
        if (response && response.length > 0) {
          const header = ['id', '主节点', '关系', '从节点', '权重', '类目']
          const data = response.map(item => {
            return [
              uuidv4(),
              item.subject,
              item.relation,
              item.object,
              item.sweight,
              item.oweight,
            ]
          })

          fileData.rowCount = data.length
          fileData.columnStats.splice
          (0,
              fileData.columnStats.length,
              ...analyzeColumns2(data, header)
          )

          dataset.source = data
          dataset.dimension = header

          console.log(dataset.source)
          console.log(dataset.dimension)

          const keep = Cs[0]

          Cs.length = 0
          Cs.push(keep)
          Ss.length = 0

          echartsOptions.series.length = 0
          echartsOptions.radar.length = 0
          echartsOptions.radiusAxis.length = 0
          echartsOptions.angleAxis.length = 0
          echartsOptions.yAxis.length = 0
          echartsOptions.xAxis.length = 0
          echartsOptions.polar.length = 0
          echartsOptions.grid.length = 0

          const elements = echartsOptions.graphic.elements
          if (elements.length>2){
            elements.splice(2,elements.length-2)
          }


          const { isLoadRelation,chartInstance} = storeToRefs(useOptionConfig())
          chartInstance.value.off('selectchanged')
          chartInstance.value.off('mousedown')
          isLoadRelation.value = false

          addRelation2()

          messages.value.push({
            text: `帮你找到${response.length}条关系,您可以开始构建关系图了`,
            type: 'ai'
          });
        } else {
          messages.value.push({
            text: '未解析出有效关系，请尝试更具体的描述',
            type: 'ai'
          });
        }
      })
      .catch((err) => {
        console.error('API Error:', err);

        // 移除"正在处理"消息
        if (processingMessageIndex !== null) {
          messages.value.splice(processingMessageIndex, 1);
          processingMessageIndex = null;
        }

        // 添加错误消息
        messages.value.push({
          text: '解析失败，请重试或检查网络连接',
          type: 'ai'
        });
      })
      .finally(() => {
        // 重置加载状态
        isLoading.value = false;
        scrollToBottom();
      });

};

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    const container = document.querySelector('.chat-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
};

</script>

<style scoped>
.floating-ai-button {
  position: fixed;
  z-index: 9999;
  transform: translate(0, 0);
  right: 10px;
  bottom: 10px;
}

.button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px
}

.ai-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--theme-hover-color), #a777e3);
  border: none;
  color: var(--font-color);
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s, box-shadow 0.2s;
}

.ai-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.ai-button svg {
  width: 30px;
  height: 30px;
}

.chat-container {
  width: 440px;
  height: 600px;
  background: var(--1-background-color);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, var(--theme-hover-color), #a777e3);
  color: var(--font-color);
  padding: 15px;
  font-weight: bold;
  text-align: center;
}

.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: var(--2-background-color);
}

.message {
  margin-bottom: 12px;
  padding: 10px 15px;
  border-radius: 18px;
  max-width: 80%;
  word-wrap: break-word;
}

.message.user {
  background:var(--theme-hover-color);
  color: var(--font-color);
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.message.ai {
  background: var(--3-background-color);
  color: var(--font-color);
  margin-right: auto;
  border-bottom-left-radius: 4px;
}

.chat-input {
  display: flex;
  padding: 15px;
  color: var(--font-color);
  border-top: 1px solid #eee;
}

.chat-input input {
  background: var(--2-background-color);
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 24px;
  outline: none;
  /* 确保输入框可点击 */
  pointer-events: auto;
}

.chat-input button {
  margin-left: 10px;
  padding: 10px 20px;
  background: var(--theme-hover-color);
  color: var(--font-color);
  border: none;
  border-radius: 24px;
  cursor: pointer;
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: var(--3-background-color);
}

.chat-messages::-webkit-scrollbar-thumb {
  background: var(--3-background-color);
  border-radius: 3px;
}
</style>