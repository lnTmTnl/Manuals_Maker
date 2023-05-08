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
    type: "rotateTransition",
    message0: "rotate: %1%2%3 in %4 seconds",
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
      {
        type: "field_number",
        name: "gaptime",
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
    type: "rotateToTransition",
    message0: "rotate to: %1%2%3 in %4 seconds",
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
      {
        type: "field_number",
        name: "gaptime",
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
    type: "moveTransition",
    message0: "move: %1%2%3 in %4 seconds",
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
      {
        type: "field_number",
        name: "gaptime",
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
    type: "moveToTransition",
    message0: "move to: %1%2%3 in %4 seconds",
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
      {
        type: "field_number",
        name: "gaptime",
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
  {
    type: "hide",
    message0: "hide",
    previousStatement: null,
    nextStatement: null,
    style: "colour_blocks",
  },
  {
    type: "opacity",
    message0: "opacity: %1",
    args0: [
      {
        type: "field_number",
        name: "opacity",
        value: 1,
        min: 0,
        max: 1,
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

javascriptGenerator["rotateTransition"] = function (block) {
  const rotateX = block.getFieldValue("X")
  const rotateY = block.getFieldValue("Y")
  const rotateZ = block.getFieldValue("Z")
  const gaptime = block.getFieldValue("gaptime")

  const eulerX = (Math.PI * rotateX) / 180
  const eulerY = (Math.PI * rotateY) / 180
  const eulerZ = (Math.PI * rotateZ) / 180

  const code = `
  let currentEulerX = 0
  let currentEulerY = 0
  let currentEulerZ = 0
  let originX = this.rotation.x
  let originy = this.rotation.y
  let originZ = this.rotation.z
  let animate=()=>{
    requestAnimationFrame( animate )
    if(Math.abs(currentEulerX) < ${Math.abs(eulerX)}
    || Math.abs(currentEulerY) < ${Math.abs(eulerY)}
    || Math.abs(currentEulerZ) < ${Math.abs(eulerZ)}) {
      this.rotation.x += ${eulerX} / ${gaptime * 60};
      this.rotation.y += ${eulerY} / ${gaptime * 60};
      this.rotation.z += ${eulerZ} / ${gaptime * 60};
      currentEulerX += ${eulerX} / ${gaptime * 60}
      currentEulerY += ${eulerY} / ${gaptime * 60}
      currentEulerZ += ${eulerZ} / ${gaptime * 60}
    }
    else{
		  this.rotation.x = originX + ${eulerX}
      this.rotation.y = originy + ${eulerY}
      this.rotation.z = originZ + ${eulerZ}
	  }
  }
  animate()
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

javascriptGenerator["rotateToTransition"] = function (block) {
  const targetRotateX = block.getFieldValue("X")
  const targetRotateY = block.getFieldValue("Y")
  const targetRotateZ = block.getFieldValue("Z")
  const gaptime = block.getFieldValue("gaptime")

  const targetEulerX = (Math.PI * targetRotateX) / 180
  const targetEulerY = (Math.PI * targetRotateY) / 180
  const targetEulerZ = (Math.PI * targetRotateZ) / 180

  const code = `
  const eulerX = ${targetEulerX} - this.rotation.x
  const eulerY = ${targetEulerY} - this.rotation.y
  const eulerZ = ${targetEulerZ} - this.rotation.z
  let currentEulerX = 0
  let currentEulerY = 0
  let currentEulerZ = 0
  let animate=()=>{
    requestAnimationFrame( animate )
    if(currentEulerX < eulerX
    || currentEulerY < eulerY
    || currentEulerZ < eulerZ) {
      this.rotation.x += eulerX / ${gaptime * 60};
      this.rotation.y += eulerY / ${gaptime * 60};
      this.rotation.z += eulerZ / ${gaptime * 60};
      currentEulerX +=  eulerX / ${gaptime * 60}
      currentEulerY +=  eulerY / ${gaptime * 60}
      currentEulerZ +=  eulerZ / ${gaptime * 60}
    }
    else {
      this.rotation.x = ${targetEulerX}
      this.rotation.y = ${targetEulerY}
      this.rotation.z = ${targetEulerZ}
    }
  }
  animate()
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

javascriptGenerator["moveTransition"] = function (block) {
  const moveX = block.getFieldValue("X")
  const moveY = block.getFieldValue("Y")
  const moveZ = block.getFieldValue("Z")
  const gaptime = block.getFieldValue("gaptime")

  const code = `
  let currentX = 0
  let currentY = 0
  let currentZ = 0
  let animate=()=>{
    requestAnimationFrame( animate )
    if(Math.abs(currentX) < ${Math.abs(moveX)}
    || Math.abs(currentY) < ${Math.abs(moveY)}
    || Math.abs(currentZ) < ${Math.abs(moveZ)}){
      this.position.x += ${moveX / (gaptime * 60)};
      this.position.y += ${moveY / (gaptime * 60)};
      this.position.z += ${moveZ / (gaptime * 60)};
      currentX += ${moveX / (gaptime * 60)}
      currentY += ${moveY / (gaptime * 60)}
      currentZ += ${moveZ / (gaptime * 60)}
    }
  }
  animate()
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

javascriptGenerator["moveToTransition"] = function (block) {
  const targetMoveX = block.getFieldValue("X")
  const targetMoveY = block.getFieldValue("Y")
  const targetMoveZ = block.getFieldValue("Z")
  const gaptime = block.getFieldValue("gaptime")

  const code = `
  let currentX = 0
  let currentY = 0
  let currentZ = 0
  const originX = this.position.x
  const originY = this.position.y
  const originZ = this.position.z
  const moveX = ${targetMoveX} - originX
  const moveY = ${targetMoveY} - originY
  const moveZ = ${targetMoveZ} - originZ
  let animate=()=>{
    requestAnimationFrame( animate )
    if(Math.abs(currentX) < Math.abs(moveX)
    || Math.abs(currentY) < Math.abs(moveY)
    || Math.abs(currentZ) < Math.abs(moveZ)){
      this.position.x += moveX / ${gaptime * 60};
      this.position.y += moveY / ${gaptime * 60};
      this.position.z += moveZ / ${gaptime * 60};
      currentX += moveX / ${gaptime * 60}
      currentY += moveY / ${gaptime * 60}
      currentZ += moveZ / ${gaptime * 60}
    }
  }
  animate()
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

javascriptGenerator["hide"] = function (block) {
  const code = `
  this.material.opacity = 0
  this.material.transparent = true
  this.material.dispose()
  `
  return code
}

javascriptGenerator["opacity"] = function (block) {
  const opacity = block.getFieldValue("opacity")

  const code = `
  this.material.opacity = ${opacity}
  this.material.transparent = true
  this.material.dispose()
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
      type: "rotateTransition",
    },
    {
      kind: "block",
      type: "rotateTo",
    },
    {
      kind: "block",
      type: "rotateToTransition",
    },
    {
      kind: "block",
      type: "move",
    },
    {
      kind: "block",
      type: "moveTransition",
    },
    {
      kind: "block",
      type: "moveTo",
    },
    {
      kind: "block",
      type: "moveToTransition",
    },
    {
      kind: "block",
      type: "scale",
    },
    {
      kind: "block",
      type: "hide",
    },
    {
      kind: "block",
      type: "opacity",
    },
  ],
  colour: "210",
}

export { threeBlocks }
