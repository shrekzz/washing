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

const handleSheetList = sheetlist => {
  sheetlist.forEach(item => {
    for (let i = 1; i < item.data[3].length; i += 2) {
      item.data[3][i] = item.data[1][i - 1]
    }
    delete item.data.splice(0, 3)
    const len = item.data[0].length

    for (let i = 0; i < item.data.length; i++) {
      for (let j = len; j > 0; j -= 2) {
        item.data[i].splice(j, 1)
      }
    }
  })

  const start = sheetlist[0].data
  for (var k = 1; k < sheetlist.length - 1; k++) {
    for (var i = 0; i < start.length; i++) {
      if (i < sheetlist[k].data.length) {
        start[i].push(...sheetlist[k].data[i].slice(1))
      } else {
        start[i].push('')
        console.log('表 ' + k + ', 行' + i + '缺失点')
      }
    }
  }
  return start
}
export { timeFormat, sizeFormat, handleSheetList }
