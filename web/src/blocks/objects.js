import Blockly from "blockly"
import { javascriptGenerator } from "blockly/javascript"

function getObjectBlocks(editor) {
  const objectOptions = editor.scriptableObjects
    ? editor.scriptableObjects.map((uuid) => {
        const obj = editor.scene.getObjectByProperty("uuid", uuid)
        const objFullname = obj.name + "/" + obj.type
        return [objFullname, uuid]
      })
    : [["none", "none"]]
  Blockly.defineBlocksWithJsonArray([
    {
      type: "object",
      message0: "object %1",
      args0: [
        {
          type: "field_dropdown",
          name: "objectuuid",
          options: objectOptions,
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

  return objectBlocks
}

export { getObjectBlocks }
