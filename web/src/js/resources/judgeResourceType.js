function judgeResourceType(fileName) {
  const extension = fileName.split(".").pop().toLowerCase()

  if (["obj", "fbx"].includes(extension)) {
    return "model"
  } else if (["avi", "mp4"].includes(extension)) {
    return "video"
  } else if (["wav", "mp3"].includes(extension)) {
    return "music"
  } else if (["jpg", "png", "svg"].includes(extension)) {
    return "img"
  } else {
    return "unknown"
  }
}

export { judgeResourceType }
