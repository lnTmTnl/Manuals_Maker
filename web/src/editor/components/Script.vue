<template>
  <div id="script-container" ref="scriptContainer">
    <BlocklyComponent
      ref="blocklyComponent"
      :editor="props.editor"
      v-show="script.blocklyDisplay"
      @showCode="showCode"
    ></BlocklyComponent>
  </div>
</template>

<script setup>
import { SetScriptValueCommand } from "@/editor/js/commands/SetScriptValueCommand.js"
import BlocklyComponent from "@/components/BlocklyComponent.vue"
import { Script } from "@/editor/js/Script.js"
import { reactive, ref, toRaw } from "@vue/reactivity"
import { computed, onMounted, watch } from "@vue/runtime-core"

const scriptContainer = ref(null)
const blocklyComponent = ref(null)
const currentScript = ref(null)
const props = defineProps(["editor"])
const script = reactive(new Script(props.editor))

onMounted(() => {
  scriptContainer.value.appendChild(script.dom)
  script.blocklyDisplay = false

  script.signals.editScript.add(function (object, script) {
    blocklyComponent.value.loadBlocks(script.blocksJson)
    currentScript.value = script
  })

  // script.signals.objectSelected.add(function () {
  //   console.log(props.editor.selected)
  //   console.log(script)
  // })
  //blocklyComponent.value.saveBlocks()
})

function showCode(code) {
  //console.log(script.codemirror.getDoc().setValue)
  toRaw(script.codemirror).setValue(code.value)
  blocklyComponent.value.saveBlocks(currentScript.value)
  // props.editor.execute(
  //   new SetScriptValueCommand(
  //     props.editor,
  //     props.editor.selected,
  //     script,
  //     "source",
  //     code.value
  //   )
  // )
  props.editor.signals.scriptChanged.dispatch()
}

function injectBlocks() {
  blocklyComponent.value.injectBlocks(blocklyComponent.value.getBlockTree())
}

defineExpose({
  injectBlocks,
})
</script>

<style scoped></style>
