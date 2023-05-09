import Blockly from "blockly"
import { javascriptGenerator } from "blockly/javascript"

function getObjectBlocks(editor) {
  Blockly.defineBlocksWithJsonArray([
    {
      type: "object",
      message0: "object %1",
      args0: [
        {
          type: "field_variable",
          name: "objectuuid",
          variable: "item",
          variableTypes: editor.scriptableObjects,
        },
      ],
      previousStatement: null,
      nextStatement: null,
      style: "colour_blocks",
    },
  ])

  javascriptGenerator["object"] = function (block) {
    const objectuuid = block.getFieldValue("objectuuid")

    const code = `${objectuuid}`
    return code
  }

  const objectBlocks = {
    kind: "category",
    name: "objects",
    contents: [
      {
        kind: "block",
        type: "object",
      },
    ],
  }
}

export { getObjectBlocks }
