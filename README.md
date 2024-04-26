# 模版编辑组件

用途：在低代码平台中需要有编辑字符串模版，例如一个字符串部分是静态字符串，一部分是由数据库中字段的值替换，下图的例子中，我们编辑了一个字符串模版，并把这个字符串模版翻译成了最后的实际值

![这是一个示例图片](https://github.com/Baozi926/text-template-editor/raw/main/case.png)

#安装

```


npm i text-template-editor

//or
yarn add text-template-editor


```

# 例子

```vue

<script setup lang="ts">

//引入组件
import TextTemplateEditor from "text-template-editor";
//引入组件样式，也可以根据class自己写
import "text-template-editor/dist/style.css";
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


组件默认样式，可自行覆盖
```scss
.text-editor-chm {
  .cm-line {
    line-height: 1.7; /* 或者使用其他值，根据你的需求调整 */
  }
  .field-placeholder {
    padding: 2px 5px;
    margin: 0 2px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
  }
}

```