import * as THREE from "three"

import { zipSync, strToU8 } from "three/addons/libs/fflate.module.js"

import { UIPanel, UIRow, UIHorizontalRule } from "./libs/ui.js"

import { ref } from "@vue/reactivity"
import axios from "axios"
import { useRoute } from "vue-router"

function MenubarSteps(editor) {
  const strings = editor.strings

  const container = new UIPanel()
  container.setClass("menu")

  const title = new UIPanel()
  title.setClass("title")
  title.setTextContent(strings.getKey("menubar/steps"))
  container.add(title)

  const options = new UIPanel()
  options.setClass("options")
  container.add(options)

  const addStepDisplay = ref(false)
  container.addStepDisplay = addStepDisplay

  container.setSteps = function (steps, clickEvent) {
    options.clear()
    let option = new UIRow()
    option.setClass("option")
    option.setTextContent(strings.getKey("menubar/steps/add"))
    option.onClick(() => {
      addStepDisplay.value = true
    })
    options.add(option)

    option = new UIRow()
    option.setClass("option")
    option.setTextContent(strings.getKey("menubar/steps/delete"))
    options.add(option)

    options.add(new UIHorizontalRule())

    steps.forEach((step) => {
      const option = new UIRow()
      option.setClass("option")
      option.setTextContent(step)
      option.onClick(() => {
        clickEvent(step)
      })
      options.add(option)
    })
  }

  return container
}

export { MenubarSteps }
