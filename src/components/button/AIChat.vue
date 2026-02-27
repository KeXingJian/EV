<template>
  <div class="floating-ai-button">
    <div class="button-wrapper" @dragover.prevent="handleDragOver" @drop.prevent="handleDrop"> >
      <div v-if="expanded" class="chat-container">
        <div class="chat-header">AI助手</div>
        <div class="chat-messages">
          <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.type]">
            {{ msg.text }}
          </div>
        </div>
        <!-- 上传按钮 (左上方) -->

        <div class="upload-area">
          <RadioBox
              v-model="dataType"
              :options="dataTypeSelect"
              :name="'dataTypeSelectAIChat'"
          ></RadioBox>
          <div>
            <label for="file-upload" class="upload-btn" :class="{ 'disabled': isLoading }">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                   fill="#e8eaed">
                <path
                    d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/>
              </svg>
              <span>上传文件</span>
            </label>
          </div>

        </div>

        <div class="chat-input">

          <input
                id="file-upload"
                type="file"
                accept=".txt,.doc,.docx"
                @change="handleFileChange"
                :disabled="isLoading"
                hidden
            />
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
import {ref, nextTick} from 'vue';
import {
  getStructuredData,
  getStructuredDataByText,
  getTripleData,
  getTripleDataByFile,
  test
} from "../../api/EVsApi.js";
import {v4 as uuidv4} from "uuid";
import {analyzeColumns2} from "../../utils/ExcelUtils.js";
import {useOptionConfig} from "../../store/OptionConfig.js";
import RadioBox from "../box/RadioBox.vue";
import {init} from "../../utils/InitUtils.js";
import {checkSeries} from "../../utils/newArch/Check4Series.js";


const {
  fileData,
  dataset,
  addRelation,
  addX0Y,Cs,addSeries,Ss,echartsOptions
} = useOptionConfig()

let fileContent = null

// 拖拽状态
const isDragging = ref(false);

// 组件状态
const expanded = ref(false)
const inputText = ref('')
const messages = ref([
  { text: '你好！我可帮你检索并抽取信息,从而快速构建关系图', type: 'ai' }
])

const inputRef = ref()
const isLoading = ref(false)
let processingMessageIndex = null

const dataTypeSelect = [
  {
    value: 0,
    label: '多维数据',
  },
  {
    value: 1,
    label: '关系数据'
  }
]

let dataType = 0

const toggleChat = () => {
  expanded.value = !expanded.value;
  if (expanded.value) {
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
}

// 发送消息
const sendMessage = async () => {
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

  let response

  try {
    if(dataType===0){
      if (fileContent) response = await getStructuredDataByText(fileContent, userMessage)
      else response = await getStructuredData(userMessage)
    }else {
      if (fileContent) response = await getTripleDataByFile(fileContent, userMessage)
      else response = await getTripleData(userMessage)
    }

    //根据响应生成结果消息
    if (response?.code === 200) {
      handleResponse(response)
      messages.value.push({
        text: `帮你找到${response.data.length}条关系,您可以开始构建关系图了`,
        type: 'ai'
      });
    } else if (response?.code === 201)
      messages.value.push({
        text: '未解析出有效关系，请尝试更具体的描述,也不排除ai变笨了,您可以尝试重试',
        type: 'ai'
      })
    else if ([500, 501].includes(response?.code))
      messages.value.push({
        text: '网络繁忙,请重试',
        type: 'ai'
      })
    else messages.value.push({
        text: '请求失败,请检查网络',
        type: 'ai'
      })

  }catch (e){
    messages.value.push({
      text: '服务调用失败',
      type: 'ai'
    })
  }finally {
    // 移除"正在处理"消息
    if (processingMessageIndex !== null) {
      messages.value.splice(processingMessageIndex, 1);
      processingMessageIndex = null;
    }
    // 重置加载状态
    isLoading.value = false;
    scrollToBottom();
    fileContent = null
  }
}

const handleResponse = (response)=>{

  let header

  const data = response.data.map(item => {
    return [
      uuidv4(),
      ...item
    ]
  })

  header = dataType === 0 ? data[0]: ['id', '主节点', '关系', '从节点', '主权重', '从权重']
  const endData = dataType === 0 ? data.slice(1) : data
  // const data  = [
  //   ["乌克兰", "地理分裂", "亲西派", 95, 80],
  //   ["乌克兰", "地理分裂", "亲俄派", 95, 80],
  //   ["乌克兰西部", "主张", "融入欧洲", 85, 70],
  //   ["乌克兰东部", "经济依赖", "俄罗斯", 85, 70],
  //   ["克里米亚", "俄族占比", "俄罗斯", 90, 75],
  //   ["俄罗斯", "吞并", "克里米亚", 95, 85],
  //   ["美国", "支持", "乌克兰亲西派", 90, 75],
  //   ["俄罗斯", "支持", "乌克兰亲俄派", 90, 75],
  //   ["北约", "吸纳候选国", "乌克兰", 85, 70],
  //   ["欧盟", "提供援助", "乌克兰", 85, 70],
  //   ["美国国际开发署", "资助", "乌克兰反对派", 80, 65],
  //   ["俄罗斯", "能源施压", "乌克兰政局", 85, 70],
  //   ["橙色革命", "触发", "尤先科上台", 80, 65],
  //   ["普京", "支持", "亚努科维奇", 85, 70],
  //   ["顿巴斯", "工业基础", "苏联", 80, 65],
  //   ["加利西亚", "民族主义起源", "奥匈帝国", 75, 60],
  //   ["西伯利亚力量2号", "影响路线", "乌克兰", 80, 65],
  //   ["东正教会", "支持", "俄罗斯军事行动", 75, 60],
  //   ["美国两党", "共识", "援乌政策", 80, 65],
  //   ["欧洲右翼", "质疑", "援乌力度", 70, 55],
  //   ["欧洲左翼", "主张", "和平谈判", 70, 55],
  //   ["乌克兰宪法", "规定", "1991年边界", 85, 70],
  //   ["俄罗斯宪法", "纳入", "乌东四州", 90, 75],
  //   ["TB-2无人机", "攻击", "西伯利亚基地", 75, 60],
  //   ["认知战", "影响", "普京民众支持度", 70, 55],
  //   ["社交媒体", "传播", "战损信息", 75, 60],
  //   ["乌克兰", "主张", "黑海出海口", 80, 65],
  //   ["俄罗斯", "控制", "能源通道", 85, 70],
  //   ["基辅罗斯", "起源", "俄罗斯", 70, 55],
  //   ["基辅罗斯", "起源", "乌克兰", 70, 55],
  //   ["弗拉基米尔大公", "引入", "东正教", 75, 60],
  //   ["莫斯科公国", "分裂自", "基辅罗斯", 70, 55],
  //   ["瓦良格卫队", "建立", "基辅罗斯", 75, 60],
  //   ["留里克", "统治", "诺夫哥罗德", 70, 55],
  //   ["奥列格", "征服", "基辅", 75, 60],
  //   ["拜占庭", "签订条约", "基辅罗斯", 70, 55],
  //   ["伊戈尔", "远征失败", "拜占庭", 65, 50],
  //   ["乌克兰", "受制于", "北约东扩", 80, 65],
  //   ["俄罗斯", "反对", "北约东扩", 85, 70],
  //   ["克里米亚事件", "加剧", "俄乌对立", 90, 75],
  //   ["欧盟", "制裁", "俄罗斯", 85, 70],
  //   ["美国", "提供军援", "乌克兰", 90, 75],
  //   ["俄罗斯", "军事行动", "乌克兰", 95, 85],
  //   ["顿巴斯", "存在", "亲俄武装", 85, 70],
  //   ["克里米亚", "驻扎", "俄罗斯军队", 90, 75],
  //   ["乌克兰", "申请", "加入欧盟", 85, 70],
  //   ["俄罗斯", "主张", "去军事化", 80, 65],
  //   ["美国", "主导", "北约", 90, 75],
  //   ["欧洲议会", "决议", "支持乌克兰", 80, 65],
  //   ["匈牙利", "反对", "援乌资金", 70, 55],
  //   ["波兰", "主张", "强硬俄罗斯", 75, 60],
  //   ["德国", "输送武器", "乌克兰", 80, 65],
  //   ["法国", "调解", "俄乌冲突", 75, 60],
  //   ["土耳其", "斡旋", "粮食出口", 70, 55],
  //   ["中国", "主张", "政治解决", 70, 55],
  //   ["印度", "保持中立", "俄乌冲突", 65, 50],
  //   ["日本", "制裁", "俄罗斯", 75, 60],
  //   ["韩国", "提供援助", "乌克兰", 70, 55],
  //   ["白俄罗斯", "支持", "俄罗斯", 80, 65],
  //   ["摩尔多瓦", "担忧", "冲突外溢", 65, 50],
  //   ["格鲁吉亚", "警惕", "俄罗斯影响", 70, 55],
  //   ["美国军工复合体", "受益", "俄乌战争", 75, 60],
  //   ["俄罗斯天然气", "影响", "欧洲能源", 85, 70],
  //   ["乌克兰", "控制", "第聂伯河", 75, 60],
  //   ["俄罗斯", "封锁", "乌克兰港口", 80, 65],
  //   ["联合国", "决议", "谴责俄罗斯", 80, 65],
  //   ["国际法院", "裁决", "克里米亚归属", 70, 55],
  //   ["红十字会", "援助", "战区平民", 65, 50],
  //   ["黑客组织", "攻击", "双方基础设施", 70, 55],
  //   ["社交媒体", "塑造", "战争叙事", 75, 60],
  //   ["无人机", "改变", "战场态势", 75, 60],
  //   ["星链", "支持", "乌军通信", 70, 55],
  //   ["网络战", "影响", "战争进程", 75, 60],
  //   ["能源价格", "波动", "全球市场", 70, 55],
  //   ["粮食危机", "加剧", "非洲国家", 65, 50],
  //   ["战俘交换", "协调", "红十字会", 60, 45],
  //   ["战争罪行", "调查", "国际刑事法院", 70, 55],
  //   ["平民伤亡", "统计", "联合国机构", 65, 50],
  //   ["文化遗产", "受损", "战争", 60, 45],
  //   ["环境破坏", "评估", "国际组织", 60, 45],
  //   ["战后重建", "规划", "世界银行", 65, 50],
  //   ["战争记忆", "塑造", "乌克兰社会", 70, 55],
  //   ["历史叙事", "争夺", "俄乌双方", 75, 60],
  //   ["东正教", "分裂", "普世牧首区", 65, 50],
  //   ["天主教", "支持", "乌克兰教会", 65, 50],
  //   ["俄罗斯", "控制", "克里米亚能源", 80, 65],
  //   ["乌克兰", "寻求", "西方安全保障", 85, 70],
  //   ["美国", "驻军", "波兰", 75, 60],
  //   ["北约", "增兵", "波罗的海国家", 80, 65],
  //   ["俄罗斯", "军演", "白俄罗斯", 75, 60],
  //   ["乌克兰", "实施", "征兵动员", 80, 65],
  //   ["俄罗斯", "局部动员", "征兵", 85, 70],
  //   ["瓦格纳集团", "参与", "顿巴斯战役", 70, 55],
  //   ["亚速营", "驻守", "马里乌波尔", 75, 60],
  //   ["克里米亚鞑靼人", "反对", "俄罗斯占领", 70, 55],
  //   ["顿巴斯", "存在", "俄语人口", 80, 65],
  //   ["乌克兰", "推行", "去俄化政策", 75, 60],
  //   ["俄罗斯", "宣传", "去纳粹化", 80, 65],
  //   ["美国", "训练", "乌军士兵", 85, 70],
  //   ["英国", "提供武器", "乌克兰", 80, 65],
  //   ["德国", "输送防空系统", "乌克兰", 75, 60],
  //   ["法国", "派遣", "军事顾问", 70, 55],
  //   ["土耳其", "出售无人机", "乌克兰", 75, 60],
  //   ["伊朗", "提供无人机", "俄罗斯", 70, 55],
  //   ["朝鲜", "提供弹药", "俄罗斯", 65, 50],
  //   ["中国", "保持", "战略模糊", 70, 55],
  //   ["印度", "采购", "俄罗斯石油", 65, 50],
  //   ["巴西", "主张", "和平谈判", 60, 45],
  //   ["南非", "军演", "俄罗斯舰队", 65, 50],
  //   ["东盟", "呼吁", "停火", 60, 45],
  //   ["非洲联盟", "调解", "冲突", 60, 45],
  //   ["战争经济", "促进", "军工生产", 70, 55],
  //   ["能源转型", "加速", "欧洲", 75, 60],
  //   ["粮食协议", "中断", "俄罗斯", 80, 65],
  //   ["黑海", "争夺", "制海权", 75, 60],
  //   ["克里米亚大桥", "战略价值", "俄罗斯", 80, 65],
  //   ["亚速海", "控制权", "俄罗斯", 75, 60],
  //   ["哈尔科夫", "争夺", "俄乌", 80, 65],
  //   ["赫尔松", "易手", "乌克兰", 75, 60],
  //   ["巴赫穆特", "战役", "瓦格纳集团", 70, 55],
  //   ["马里乌波尔", "围城", "亚速营", 75, 60],
  //   ["敖德萨", "防御", "乌克兰", 70, 55],
  //   ["基辅", "防御", "乌克兰", 80, 65],
  //   ["切尔尼戈夫", "遭遇战", "俄乌", 70, 55],
  //   ["苏梅", "攻防", "俄乌", 65, 50],
  //   ["第聂伯罗", "后勤枢纽", "乌克兰", 70, 55],
  //   ["扎波罗热", "核电站争夺", "俄乌", 75, 60],
  //   ["库尔斯克", "遭袭", "俄罗斯", 70, 55],
  //   ["别尔哥罗德", "袭击", "乌克兰", 70, 55],
  //   ["莫斯科", "遭袭", "无人机", 75, 60],
  //   ["圣彼得堡", "防御", "俄罗斯", 70, 55],
  //   ["哈尔科夫", "炮击", "俄罗斯", 75, 60],
  //   ["顿涅茨克", "亲俄政权", "俄罗斯", 80, 65],
  //   ["卢甘斯克", "亲俄政权", "俄罗斯", 80, 65],
  //   ["扎波罗热", "亲俄政权", "俄罗斯", 75, 60],
  //   ["赫尔松", "亲俄政权", "俄罗斯", 75, 60],
  //   ["乌克兰", "宣布", "反攻", 80, 65],
  //   ["俄罗斯", "宣布", "特别军事行动", 85, 70],
  //   ["战争罪", "指控", "俄罗斯军官", 70, 55],
  //   ["战俘待遇", "争议", "双方", 65, 50],
  //   ["民用设施", "打击", "争议", 70, 55],
  //   ["核设施", "安全", "国际关注", 75, 60],
  //   ["生物实验室", "指控", "美国", 65, 50],
  //   ["能源设施", "打击", "俄罗斯", 75, 60],
  //   ["基础设施", "摧毁", "乌克兰", 80, 65],
  //   ["平民撤离", "协调", "联合国", 65, 50],
  //   ["人道走廊", "建立", "争议", 60, 45],
  //   ["战争难民", "接收", "欧盟", 70, 55],
  //   ["流离失所", "统计", "乌克兰", 65, 50],
  //   ["文化遗产", "破坏", "联合国教科文组织", 60, 45],
  //   ["战争纪念", "建立", "乌克兰", 65, 50],
  //   ["历史教科书", "修订", "俄乌", 60, 45],
  //   ["语言政策", "冲突", "俄乌", 65, 50],
  //   ["宗教归属", "争夺", "乌克兰教会", 70, 55]
  // ].map(item => {
  //     return [
  //       uuidv4(),
  //       ...item
  //     ]
  //   })


  fileData.rowCount = endData.length
  fileData.columnStats.splice
  (0,
      fileData.columnStats.length,
      ...analyzeColumns2(endData, header)
  )

  dataset.source = endData
  dataset.dimension = header

  console.log(dataset.source)
  console.log(dataset.dimension)


  init()
  if(dataType===0){
    addX0Y()
    const c0 = Cs[1]
    for(let i=0;i<header.length-2;i++){
      addSeries()
      Ss[i].C = c0
      Ss[i].category = 1
      Ss[i].number = i+2
      Ss[i].type = 1
    }
    Ss.forEach(i => checkSeries(i,echartsOptions))
  }else {
    addRelation()
  }

}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    const container = document.querySelector('.chat-messages')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}

// 文件处理相关
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = [
  'text/plain',         // .txt
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
];

// 处理文件选择
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    processFile(file);
  }
}

// 处理拖拽事件
const handleDragOver = (e) => {
  e.preventDefault();
  if (!isLoading.value) {
    isDragging.value = true;
  }
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false

  const file = e.dataTransfer.files[0]
  if (file && !isLoading.value) {
    processFile(file)
  }
}

// 处理文件上传
const processFile = (file) => {
  // 检查文件类型
  if (!ALLOWED_TYPES.includes(file.type)) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['txt', 'doc', 'docx', 'pdf'].includes(ext)) {
      alert('仅支持 TXT、DOC、DOCX 和 PDF 文件');
      return;
    }
  }

  // 检查文件大小
  if (file.size > MAX_FILE_SIZE) {
    alert('文件大小不能超过 2MB');
    return
  }

  // 创建FileReader实例
  const reader = new FileReader();

  // 文件读取完成后的回调
  reader.onload = function(event) {
    const fileContentCurrent = event.target.result;
    const charCount = fileContentCurrent.length;

    // 检查是否超过1万字符限制
    if (charCount > 10000) {
      // 显示上传状态
      messages.value.push({
        text: `文本超过10,000字,无法上传`,
        type: 'ai'
      });
    } else {
      // 显示上传状态
      messages.value.push({
        text: `文件解析完毕: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        type: 'ai'
      });

      fileContent =  file
      scrollToBottom()
    }
  };
  // 开始读取文件内容（作为文本）
  reader.readAsText(file);
};

// setTimeout(()=>{
//   inputText.value = '111'
//   sendMessage()
// },1000)

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
  position: relative;
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

.upload-area{
  cursor: pointer;
  top: -30px;
  display: flex;
  background: var(--2-background-color);
  padding: 5px;
  gap: 10px;
  align-items: center;
}

.upload-area label{
  align-items: center;
  display: flex;
}
</style>