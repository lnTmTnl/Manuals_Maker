import Blockly from "blockly"
import { javascriptGenerator } from "blockly/javascript"

Blockly.defineBlocksWithJsonArray([
  // Block for colour picker.
  {
    type: "update",
    message0: "update",
    message1: "do %1",
    args1: [
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "colour_blocks",
  },
  {
    type: "click",
    message0: "click",
    message1: "do %1",
    args1: [
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "colour_blocks",
  },
  {
    type: "movePointer",
    message0: "move pointer",
    message1: "do %1",
    args1: [
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "colour_blocks",
  },
  {
    type: "separate",
    message0: "separate",
    message1: "do %1",
    args1: [
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "colour_blocks",
  },
])

javascriptGenerator["update"] = function (block) {
  const DO = javascriptGenerator.statementToCode(block, "DO")

  const code = `
function update(event) {
  ${DO}
};
  `
  return code
}

javascriptGenerator["click"] = function (block) {
  const DO = javascriptGenerator.statementToCode(block, "DO")

  const code = `
function pointerdown(event) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  pointer.x = ( event.offsetX / player.width ) * 2 - 1;
  pointer.y = - ( event.offsetY / player.height ) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  console.log(event)
  console.log(raycaster.intersectObjects( scene.children ).findIndex(obj=>obj.object.uuid === this.uuid) > -1)
  if(raycaster.intersectObjects( scene.children ).findIndex(obj=>obj.object.uuid === this.uuid) > -1){
    ${DO}
  }
};
  `
  return code
}

javascriptGenerator["movePointer"] = function (block) {
  const DO = javascriptGenerator.statementToCode(block, "DO")

  const code = `
function pointermove(event) {
  console.log(event)
  ${DO}
};
  `
  return code
}

javascriptGenerator["separate"] = function (block) {
  const DO = javascriptGenerator.statementToCode(block, "DO")

  const code = `
function separate(event) {
  console.log(event)
  ${DO}
};
  `
  return code
}

const eventBlocks = {
  kind: "category",
  name: "event",
  contents: [
    {
      kind: "block",
      type: "update",
    },
    {
      kind: "block",
      type: "click",
    },
    {
      kind: "block",
      type: "movePointer",
    },
    {
      kind: "block",
      type: "separate",
    },
  ],
  colour: "210",
}

export { eventBlocks }
