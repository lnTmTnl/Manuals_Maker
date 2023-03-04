import Blockly from "blockly"
import { javascriptGenerator } from "blockly/javascript"

Blockly.defineBlocksWithJsonArray([
  // Block for colour picker.
  {
    type: "rotate",
    message0: "rotate: %1%2%3",
    args0: [
      {
        type: "field_number",
        name: "X",
        value: 0,
      },
      {
        type: "field_number",
        name: "Y",
        value: 0,
      },
      {
        type: "field_number",
        name: "Z",
        value: 0,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "colour_blocks",
  },
  {
    type: "rotateTo",
    message0: "rotate to: %1%2%3",
    args0: [
      {
        type: "field_number",
        name: "X",
        value: 0,
      },
      {
        type: "field_number",
        name: "Y",
        value: 0,
      },
      {
        type: "field_number",
        name: "Z",
        value: 0,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "colour_blocks",
  },
  {
    type: "move",
    message0: "move: %1%2%3",
    args0: [
      {
        type: "field_number",
        name: "X",
        value: 0,
      },
      {
        type: "field_number",
        name: "Y",
        value: 0,
      },
      {
        type: "field_number",
        name: "Z",
        value: 0,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "colour_blocks",
  },
  {
    type: "moveTo",
    message0: "move to: %1%2%3",
    args0: [
      {
        type: "field_number",
        name: "X",
        value: 0,
      },
      {
        type: "field_number",
        name: "Y",
        value: 0,
      },
      {
        type: "field_number",
        name: "Z",
        value: 0,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "colour_blocks",
  },
  {
    type: "scale",
    message0: "scale: %1%2%3",
    args0: [
      {
        type: "field_number",
        name: "X",
        value: 1,
      },
      {
        type: "field_number",
        name: "Y",
        value: 1,
      },
      {
        type: "field_number",
        name: "Z",
        value: 1,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "colour_blocks",
  },
])

javascriptGenerator["rotate"] = function (block) {
  const rotateX = block.getFieldValue("X")
  const rotateY = block.getFieldValue("Y")
  const rotateZ = block.getFieldValue("Z")

  const code = `
this.rotation.x += ${rotateX};
this.rotation.y += ${rotateY};
this.rotation.z += ${rotateZ};
  `
  return code
}

javascriptGenerator["rotateTo"] = function (block) {
  const rotateX = block.getFieldValue("X")
  const rotateY = block.getFieldValue("Y")
  const rotateZ = block.getFieldValue("Z")

  const code = `
this.rotation.x = ${rotateX};
this.rotation.y = ${rotateY};
this.rotation.z = ${rotateZ};
  `
  return code
}

javascriptGenerator["move"] = function (block) {
  const moveX = block.getFieldValue("X")
  const moveY = block.getFieldValue("Y")
  const moveZ = block.getFieldValue("Z")

  const code = `
this.position.x += ${moveX};
this.position.y += ${moveY};
this.position.z += ${moveZ};
  `
  return code
}

javascriptGenerator["moveTo"] = function (block) {
  const moveX = block.getFieldValue("X")
  const moveY = block.getFieldValue("Y")
  const moveZ = block.getFieldValue("Z")

  const code = `
this.position.x = ${moveX};
this.position.y = ${moveY};
this.position.z = ${moveZ};
  `
  return code
}

javascriptGenerator["scale"] = function (block) {
  const scaleX = block.getFieldValue("X")
  const scaleY = block.getFieldValue("Y")
  const scaleZ = block.getFieldValue("Z")

  const code = `
this.scale.x = ${scaleX};
this.scale.y = ${scaleY};
this.scale.z = ${scaleZ};
  `
  return code
}

const threeBlocks = {
  kind: "category",
  name: "three",
  contents: [
    {
      kind: "block",
      type: "rotate",
    },
    {
      kind: "block",
      type: "rotateTo",
    },
    {
      kind: "block",
      type: "move",
    },
    {
      kind: "block",
      type: "moveTo",
    },
    {
      kind: "block",
      type: "scale",
    },
  ],
  colour: "210",
}

export { threeBlocks }
