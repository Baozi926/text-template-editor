# 模版编辑组件

用途：在低代码平台中需要有编辑字符串模版，例如一个字符串部分是静态字符串，一部分是由数据库中字段的值替换，下图的例子中，我们编辑了一个字符串模版，并把这个字符串模版翻译成了最后的实际值

![这是一个示例图片](./case.png)

# 例子

```vue

<script setup lang="ts">
// import TextTemplateEditor from "./components/TextTemplateEditor.vue";
import TextTemplateEditor from "text-template-editor";
import "text-template-editor/style.css"
import Mustache from "mustache";
import { ref } from "vue";
const textDict = {
  field122212312: "测试字段1",
};

const textInstanceObj = {
  field122212312: "字段实际值1",
}

const textEditorRef = ref<any>(null);
const textRef = ref("静态字符串测试+{{field122212312}}");

const translatedText = ref("");

const insertTextAtCursor = () => {
  if (!textEditorRef.value) {
    return;
  }

  textEditorRef.value.insertTextAtCursor("{{field122212312}}");
};

const doTranslate = () => {
  console.log(Mustache);

  translatedText.value = Mustache.render(textRef.value, textInstanceObj);
};
</script>

<template>
  <div class="toolbar">
    <button @click="insertTextAtCursor()">测试添加一个字段</button>
    <button @click="doTranslate">翻译</button>
  </div>

  <div class="flex-col">
    <div class="flex-item">
      <TextTemplateEditor
        ref="textEditorRef"
        :dict="textDict"
        v-model="textRef"
      />
    </div>
    <div class="flex-item">
      <div class="title">模版字符串</div>
      <div>{{ textRef }}</div>
    </div>

    <div class="flex-item">
      <div class="title">将模版翻译成实例：</div>
      <div>
        {{ translatedText }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  button {
    margin: 10px;
    background-color: rgb(193, 218, 199);
  }
}
.flex-col {
  display: flex;
  flex-direction: column;
  min-height: 60vh;
  width: 800px;
  background-color: antiquewhite;
  .flex-item {
    flex: 1;
    // align-items: center;
    display: flex;
    // justify-content: center;
    flex-direction: column;
    .title{
      background-color: aqua;
      width: 100%;
      margin-bottom: 20px;
    }
  }
}
</style>




```
