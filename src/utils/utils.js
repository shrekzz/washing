// 时间格式化
const timeFormat = (time) => {
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const date = time.getDate()
  const hours = time.getHours()
  const minutes = time.getMinutes() >= 10 ? time.getMinutes() : '0' + time.getMinutes()
  return year + '/' + month + '/' + date + ' ' + hours + ':' + minutes
}
// 文件大小格式化
const sizeFormat = (size) => {
  return (Math.floor(size / 1024) || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + ' KB'
}
// AP数据处理
const handleSheetList = sheetlist => {
  sheetlist.forEach(item => {
    // 忽略最后一个表
    if (item.name !== 'Summary') {
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

// soundcheck
const handleSouncheck = sheetlist => {
  const start = []
  sheetlist.forEach((item, index) => {
    if (index === 1) {
      item.data[0][2] = item.data[1][0]
      for (let j = 0; j < item.data.length; j++) {
        start.push(item.data[j].slice(1, 3))
      }
    }
    if (index > 1) {
      item.data[0][2] = item.data[1][0]
      for (let i = 0; i < item.data.length; i++) {
        start[i].push(item.data[i][2])
      }
    }
  })
  return start
}
// 生成二维数组
const createArray = (x, y) => {
  const a = []
  for (let i = 0; i < x; i++) {
    a.push([])
    for (let j = 0; j < y; j++) {
      a[i].push([])
    }
  }
  return a
}
// 数组转置
const reverseArray = (arr) => {
  const temp = []
  let maxLen = 0
  arr.forEach(item => {
    maxLen = maxLen <= item.length ? item.length : maxLen
  })
  for (let i = 0; i < maxLen; i++) {
    temp[i] = []
  }
  for (let i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
      temp[j][i] = arr[i][j] || ''
    }
  }
  return temp
}

// BES 数据处理
const BESConfig = (arr) => {
  const d = []
  // console.log(v.slice(v.indexOf(':') + 2 , v.length))
  const b = arr.slice(arr.indexOf('[') + 2, arr.length).split(', ')
  for (let i = 0; i < b.length; i++) {
    b[i] = b[i].replace(']', '')
    if (i % 5 !== 0 && i % 5 !== 1) {
      d.push(Number(b[i].replace(']', '')))
    }
  }
  return d
}

// excle行列格式转换
const scale = (col, row) => {
  let res = []
  while (col / 26 !== 0) {
    res.unshift(col % 26)
    col = Math.floor(col / 26)
  }
  for (let i = res.length - 1; i >= 0; i--) {
    if (res[i] === 0) {
      res[i - 1] = res[i - 1] - 1 === 0 ? '' : res[i - 1] - 1
      res[i] = 'Z'
    } else {
      res[i] = res[i] === '' ? '' : String.fromCharCode(64 + res[i])
    }
  }
  res = res.join('')
  return 'A1:' + res + row
}

export { timeFormat, sizeFormat, handleSheetList, handleSouncheck, reverseArray, createArray, BESConfig, scale }
