<template>
  <div class="text-editor-chm">
    <div class="code-mirror-div" ref="editorContainer"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import { EditorState } from "@codemirror/state";
import { minimalSetup } from "codemirror";
import {
  EditorView,
  Decoration,
  WidgetType,
  MatchDecorator,
  ViewPlugin,
} from "@codemirror/view";

const emits = defineEmits(["update:model"]);

const props = defineProps({
  modelValue: String,
  dict: Object,
});

// 定义一个WidgetType派生类来创建自定义的按钮形状装饰
class PlaceholderWidget extends WidgetType {
  constructor(content) {
    super();
    this.content = content;
  }

  ignoreEvent() {
    return false;
  }
  eq(other) {
    return this.name == other.name;
  }
  toDOM() {
    const button = document.createElement("span");

    let name = props.dict[this.content];
    if (!name) {
      console.warn("字段名不能为空");
      name = "无效的字段";
    }

    button.textContent = name; // 使用匹配到的文本作为按钮文本

    button.contenteditable = false;

    button.className = "field-placeholder"; // 应用CSS样式
    return button;
  }
}

// 使用MatchDecorator来匹配特定模式的文本并替换为自定义装饰
const placeholderMatcher = new MatchDecorator({
  // regexp: /\{\{([\s\S]+?)\}\}/g,
  regexp: /\{\{(\w+)\}\}/g,
  decoration: (match) =>
    Decoration.replace({
      widget: new PlaceholderWidget(match[1]),
    }),
});

const placeholders = ViewPlugin.fromClass(
  class {
    placeholders;
    constructor(view) {
      this.placeholders = placeholderMatcher.createDeco(view);
    }
    update(update) {
      this.placeholders = placeholderMatcher.updateDeco(
        update,
        this.placeholders
      );
    }
  },
  {
    decorations: (instance) => instance.placeholders,
    provide: (plugin) =>
      EditorView.atomicRanges.of((view) => {
        return view.plugin(plugin)?.placeholders || Decoration.none;
      }),
  }
);

const editorContainer = ref(null);
let editorView;

// 动态插入文本的函数
function insertTextAtCursor(text) {
  const currentState = editorView.state;
  // 获取当前光标位置
  let { from, to } = currentState.selection.main;

  //如果没有光标那就在末尾
  if (from === 0 && to === 0) {
    from = editorView.state.doc.length;
    to = editorView.state.doc.length;
  }

  // 创建一个事务来替换当前选区（如果有选中文本）或在光标位置插入文本
  const transaction = currentState.update({
    changes: { from, to, insert: text },
  });

  // 应用事务
  editorView.dispatch(transaction);
}

defineExpose({
  insertTextAtCursor,
});

onMounted(() => {
  const startState = EditorState.create({
    // doc: "这里是一些文本 ${aaaa}",
    doc: props.modelValue,
    extensions: [
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          // 处理文档变化
          emits("update:modelValue", update.state.doc.text.toString());
        }
      }),
      placeholders,
      minimalSetup,
      EditorView.lineWrapping,
    ],
  });

  const view = new EditorView({
    state: startState,
    parent: editorContainer.value,
  });

  editorView = view;
});

onUnmounted(() => {
  if (!editorView) {
    return;
  }
  editorView.destroy();
});
</script>

<style lang="scss">
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
</style>
