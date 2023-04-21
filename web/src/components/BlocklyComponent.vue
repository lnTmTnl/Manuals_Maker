<template>
  <div id="blockly-component"><div id="blockly">
    <div class="blocklyDiv" ref="blocklyDiv"></div>
    <xml ref="blocklyToolbox" style="display: none">
      <slot></slot>
    </xml>
    </div>
    <p id="code">
      <button v-on:click="showCode">Save Script</button>
      <!-- <button v-on:click="runCode">Run Code</button> -->
      <pre v-html="code"></pre>
    </p>
  </div>
</template>

<script setup>
import Blockly from "blockly"
import * as THREE from "three"
import { toolboxJson } from "@/blocks/base.js"
import { threeBlocks } from "@/blocks/threes.js"
import { eventBlocks } from "@/blocks/events.js"
import { javascriptGenerator } from "blockly/javascript"
import { onMounted, ref } from "@vue/runtime-core"

let workspace = null
const blocklyDiv = ref(null)
const blocklyToolbox = ref(null)

const code = ref("")

const blocksJson = ref(null)

const emit = defineEmits(["showCode", "runCode"])

toolboxJson.contents.unshift(threeBlocks, eventBlocks)

const options = ref({
  media: "/blockly_media",
  grid: {
    spacing: 25,
    length: 3,
    colour: "#ccc",
    snap: true,
  },
  toolbox: toolboxJson,
})

onMounted(() => {
  if (!options.value.toolbox) {
    options.value.toolbox = blocklyToolbox.value
  }
  workspace = Blockly.inject(blocklyDiv.value, options.value)
})

function showCode() {
  code.value = javascriptGenerator.workspaceToCode(workspace)
  emit("showCode", code)
}

function runCode() {
  code.value = javascriptGenerator.workspaceToCode(workspace)
  emit("runCode", code)
}

function saveBlocks(script) {
  script.blocksJson = Blockly.serialization.workspaces.save(workspace)
}

function loadBlocks(json) {
  Blockly.serialization.workspaces.load(json, workspace)
}

defineExpose({
  saveBlocks,
  loadBlocks
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#blockly {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50%;
  height: 50%;
  z-index: 999;
}

.blocklyDiv {
  height: 100%;
  width: 100%;
  text-align: left;
}

#code {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 25%;
  height: 50%;
  margin: 0;
  background-color: beige;
  z-index: 999;
}
</style>
