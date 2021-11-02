const timeFormat = (time) => {
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const date = time.getDate()
  const hours = time.getHours()
  const minutes = time.getMinutes()
  return year + '/' + month + '/' + date + ' ' + hours + ':' + minutes
}

const sizeFormat = (size) => {
  return (Math.floor(size / 1024) || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + ' KB'
}
export { timeFormat, sizeFormat }
