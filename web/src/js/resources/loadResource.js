import * as THREE from "three"

function loadResource(file, manager) {
  const filename = file.name

  const reader = new FileReader()
  reader.addEventListener("progress", function (event) {
    const size = "(" + Math.floor(event.total / 1000).format() + " KB)"
    const progress = Math.floor((event.loaded / event.total) * 100) + "%"

    console.log("Loading", filename, size, progress)
  })
  reader.readAsText(file)

  return loadWithResourceType(filename)
}

function loadWithResourceType(fileName, manager) {
  const extension = fileName.split(".").pop().toLowerCase()

  switch (extension) {
    case "obj": {
      reader.addEventListener(
        "load",
        async function (event) {
          const contents = event.target.result

          const { OBJLoader } = await import(
            "three/addons/loaders/OBJLoader.js"
          )

          const object = new OBJLoader().parse(contents)
          object.name = fileName

          return object
        },
        false
      )

      break
    }
  }
}

export { loadResource }
