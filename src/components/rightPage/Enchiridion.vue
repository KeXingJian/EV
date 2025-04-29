<script setup>

</script>

<template>
  <div class="doc">
    <div class="container">
      <h2>系列</h2>
      <span>
        <span class="im">坐标系</span>: 决定数据项展现<span class="im">形式</span>和<span class="im">位置</span>(饼图不是坐标系,仅令数据项以饼图展示)<br>
        <span class="im">类目</span>: 这类似f(x)=y,中的x,字段必须具有<span class="im">唯一性</span>(数据取样->ROOT可以查看字段信息)<br>
        <span class="im">数值</span>: 为其中的y,字段必须为<span class="im">数字</span><br>
        <span class="im">数据集</span>: 表示数据项来源
      </span>
    </div>
    <div class="container">
      <h2>坐标系</h2>
      <span>
        是坐标轴的容器;在美化处可以调整<span class="im">定位</span>定位与<span class="im">大小</span>(饼图在对应系列中),可以被认为一个图实例
      </span>
    </div>
    <div class="container">
      <h2>数据取样</h2>
      <span>
        <span class="im">表示式</span>: 字段 操作符 字面值(如:A>0)<br>
        <span class="im">要求</span>: 字段必须为<span class="im">大写</span>;操作符:= !=(表不等于) >= <= > <;字段<span class="im">为字符串时</span>只能使用 =和!=且字面值必须使用<span class="im">单引号包裹</span>(如:B='男')<br>
        <span class="im">过滤</span>: 保留符合表达式的数据<br>
        <span class="im">分组</span>: 将数据集中符合的数据新建数据集<br>
      </span>
      <img src="../svg/1.svg" alt="Diagram">
    </div>
    <div class="container">
      <h2>数据编辑</h2>
      <span>
        <span class="im">字段</span>: <span class="im">双击</span>即可编辑<br>
        <span class="im">数据项</span>: 修改完后<span class="im">回车</span>,令值<span class="im">居中</span>视为修改完成<br>
        <span class="im">注意</span>: 修改可能导致字段唯一性丢失,留意错误通知栏;唯一性判断方式是<span class="im">剔除空值</span>,再进行查重;若重复则不具备唯一性,亦然反之;
      </span>
    </div>
  </div>
</template>

<style scoped>
.doc {
  margin-left: 8px;
  overflow: scroll;
}

.doc::-webkit-scrollbar {
  display: none;
}

.doc span {
  color: var(--font-color);
  line-height: 1.8; /* 推荐 1.5-1.8 倍字号 */
  margin-bottom: 15px;
  font-size: 20px;
}

.container {
  border: 1px solid var(--2-background-color);
  border-radius: 1em;
  margin-bottom: 20px;
  padding: min(2em, 15%);


}

h2{
  font-size: 2em;
  font-weight: bolder;
  margin-bottom: 1em;
}

span{
  margin-top: 1em;
  font-weight: initial;
}

.im{
  font-size: 25px;
  font-weight: bolder;
}
</style>