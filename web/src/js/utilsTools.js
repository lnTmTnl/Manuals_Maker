function formatteDate(date) {
  const dateObj = new Date(date)
  const formattedDate = dateObj
    .toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Shanghai", // 设置时区
    })
    .replace(/\//g, "-")

  return formattedDate
}

export { formatteDate }
