class LimitFactory {
  constructor (sheet, limit, limitRange) {
    this.sheet = sheet
    this.limit = limit
    this.limitRange = limitRange
  }

  getResult () {
    const RSheet = this.reverseArray(this.sheet)
    const freq = RSheet[0]
    const Aline = this.getAverageLine(this.sheet)
    const golden = this.getGoldenLine(RSheet, Aline)
    const upIndex = this.findNearesttargetber(freq, this.limitRange[1])
    const lowIndex = this.findNearesttargetber(freq, this.limitRange[0])
    const res = [freq]
    const upData = golden.map((item, index) => {
      if (index === 0) {
        return '上限'
      } else if (index <= upIndex && index >= lowIndex) {
        return item + this.limit[1]
      } else {
        return '清除内容'
      }
    })
    const lowData = golden.map((item, index) => {
      if (index === 0) {
        return '下限'
      } else if (index <= upIndex && index >= lowIndex) {
        return item - this.limit[0]
      } else {
        return '清除内容'
      }
    })
    for (let i = 1; i < RSheet.length; i++) {
      if (this.comapareWithGolden(RSheet[i].slice(lowIndex, upIndex + 1), upData.slice(lowIndex, upIndex + 1), lowData.slice(lowIndex, upIndex + 1))) {
        res.push(RSheet[i])
      }
    }
    res.splice(1, 0, upData, lowData)
    return this.reverseArray(res)
  }
}

/**
 * 拟合度计算
 * @param {*} fitting
 * @param {*} NoFitting
 * @returns
 */
LimitFactory.prototype.__RR = (fitting, NoFitting) => {
  const mean = NoFitting.reduce((a, b) => a + b) / NoFitting.length
  const sstList = NoFitting.reduce((a, b) => a.concat(Math.pow(b - mean, 2)), [])
  const sseList = fitting.reduce((a, b, i) => a.concat(Math.pow(b - NoFitting[i], 2)), [])
  return 1 - sseList.reduce((a, b) => a + b) / sstList.reduce((a, b) => a + b)
}

/**
* 二分查找目标频率索引
* @param {*} arr
* @param {*} target
* @returns Number
*/
LimitFactory.prototype.findNearesttargetber = (arr, target) => {
  let mid
  let l = 0
  let r = arr.length - 1
  // 保证指针最终停留在相邻的两个数,所以这里是判断是否大于1
  while (r - l > 1) {
    mid = Math.floor((l + r) / 2)
    // 如果目标数比中间小，所以范围在左边
    if (target < arr[mid]) {
      r = mid
    } else {
      l = mid
    }
  }
  // 最后比较这两个数字的绝对差大小即可。
  return Math.abs(target - arr[l]) <= Math.abs(target - arr[r]) ? l : r
}

/**
* 二维数组反转
* @param {*} arr
* @returns
*/
LimitFactory.prototype.reverseArray = arr => {
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

/**
* 获取平均线
* @param { Array } data 表内容
* @returns { Array } adata 平均曲线
*/
LimitFactory.prototype.getAverageLine = data => {
  const adata = []
  for (let j = 1; j < data.length; j++) {
    adata.push(data[j].slice(1).reduce((a, b) => a + b) / (data[j].length - 1))
  }
  return adata
}

/**
* 获取居中曲线
* @param { Array } sheet 表内容
* @returns Array
*/
LimitFactory.prototype.getGoldenLine = function (sheet, Aline) {
  const data = []
  // 最大拟合度
  let max = 0
  // 最大拟合索引
  let maxIndex = 0
  for (var i = 1; i < sheet.length; i++) {
    data.push(sheet[i].slice(1))
  }
  data.forEach((item, index) => {
    const rr = this.__RR(Aline, item)
    if (max < rr) {
      max = rr
      maxIndex = index
    }
  })
  return sheet[maxIndex + 1]
}

/**
* 返回曲线是否在框线内
* @param { Array } arr
* @param { Array } up
* @param { Array } low
* @returns Boolean
*/
LimitFactory.prototype.comapareWithGolden = (arr, up, low) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= up[i] || arr[i] <= low[i]) {
      return false
    }
  }
  return true
}

export default LimitFactory
