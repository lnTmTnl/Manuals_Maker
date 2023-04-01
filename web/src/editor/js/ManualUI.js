import { UIDiv, UIButton } from "./libs/ui.js"

function ManualUI(player) {
  const container = new UIDiv()
  container.setId("manual-ui")
  container.setStyle("position", ["absolute"])
  container.setStyle("top", ["0"])
  container.setStyle("width", ["100%"])
  container.setStyle("height", ["100%"])

  const separateBtn = new UIButton("分离")
  separateBtn.onClick(() => {
    const separateEvent = new Event("separate")
    document.dispatchEvent(separateEvent)
  })
  container.add(separateBtn)

  return container
}

export { ManualUI }
