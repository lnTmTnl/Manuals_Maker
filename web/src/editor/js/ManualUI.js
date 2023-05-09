import { UIDiv, UIButton, UISelect } from "./libs/ui.js"
import { useRoute } from "vue-router"
import axios from "axios"

function ManualUI(player) {
  const route = useRoute()

  const manualid = route.params.manualid

  const container = new UIDiv()
  container.setId("manual-ui")
  container.setStyle("position", ["absolute"])
  container.setStyle("top", ["0"])
  container.setStyle("width", ["100%"])
  container.setStyle("height", ["100%"])

  const separateBtn = new UIButton("分离")
  separateBtn.addClass("uiBtn")
  separateBtn.addClass("separateBtn")
  separateBtn.onClick(() => {
    const separateEvent = new Event("separate")
    document.dispatchEvent(separateEvent)
  })
  container.add(separateBtn)

  const recoverBtn = new UIButton("复原")
  recoverBtn.addClass("uiBtn")
  recoverBtn.addClass("recoverBtn")
  recoverBtn.onClick(() => {
    player.load(player.initJson)
    player.setSize(window.innerWidth, window.innerHeight)
    player.play()
    const recoverEvent = new Event("recover")
    document.dispatchEvent(recoverEvent)
  })
  container.add(recoverBtn)

  const preStepBtn = new UIButton("<")
  preStepBtn.addClass("uiBtn")
  preStepBtn.addClass("preStepBtn")
  preStepBtn.onClick(() => {
    const preStepEvent = new Event("preStep")
    document.dispatchEvent(preStepEvent)

    const currentStepIndex = parseInt(stepSelect.getValue())
    const stepCount = stepSelect.options.length
    const sum = currentStepIndex - 1 + stepCount
    loadStep(sum % stepCount)
  })
  container.add(preStepBtn)

  const nextStepBtn = new UIButton(">")
  nextStepBtn.addClass("uiBtn")
  nextStepBtn.addClass("nextStepBtn")
  nextStepBtn.onClick(() => {
    const nextStepEvent = new Event("nextStep")
    document.dispatchEvent(nextStepEvent)

    const currentStepIndex = parseInt(stepSelect.getValue())
    const stepCount = stepSelect.options.length
    const sum = currentStepIndex + 1 + stepCount
    console.log("stepCount: " + stepCount)
    console.log("currentStepIndex: " + currentStepIndex)
    console.log(sum)
    loadStep(sum % stepCount)
  })
  container.add(nextStepBtn)

  const stepSelect = new UISelect()

  stepSelect.addClass("uiSelect")
  stepSelect.addClass("stepSelect")

  stepSelect.onChange(() => {
    const selectStepEvent = new Event("selectStep")
    document.dispatchEvent(selectStepEvent)

    const stepIndex = stepSelect.getValue()
    loadStep(stepIndex)
  })

  container.setSteps = function (steps) {
    stepSelect.setOptions(steps)
  }

  function loadStep(stepIndex) {
    stepSelect.setValue(stepIndex)

    const stepname = stepSelect.getOption(stepIndex)

    axios
      .get("/getManualStep/" + manualid + "/" + stepname)
      .then((res) => {
        const stepJson = res.data.data
        player.initJson = stepJson
        player.load(stepJson)
        player.setSize(window.innerWidth, window.innerHeight)
        player.play()
      })
      .catch((res) => {
        console.log(res)
      })
  }

  container.loadStep = loadStep

  container.add(stepSelect)

  return container
}

export { ManualUI }
