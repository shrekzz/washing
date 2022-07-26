const robot = require('robotjs')
const { clipboard } = require('electron')
// Speed up the mouse.
// Get mouse position.

// 一维数组转二维数组
const setTwoDimensionalArray = list => {
  const listResult = []
  for (let i = 0; i < Math.ceil((list.length / 3)); i++) {
    listResult[i] = []
    for (let j = 0; j < 3; j++) {
      // 如果是最后一个板块
      if (i === (Math.ceil((list.length / 3)) - 1)) {
        if (Math.ceil((list.length % 3)) !== 0) {
          // 只有最后一个板块的数据在余数以内的才赋值
          if (j < Math.ceil((list.length % 3))) {
            listResult[i][j] = list[i * 3 + j]
          }
        } else {
          // 如果刚好整整一个板块，则全部附上值
          listResult[i][j] = list[i * 3 + j]
        }
      } else {
        listResult[i][j] = list[i * 3 + j]
      }
    }
  }
  return listResult
}
/*
  默认F和Gain互换,r1、r2要交换的位置
*/
const freq2Gain = (arr, r1 = 1, r2 = 2) => {
  for (var i = 0; i < arr.length; i++) {
    var temp = arr[i][r1]
    arr[i][r1] = arr[i][r2]
    arr[i][r2] = temp
  }
  return arr
}
/*
  自动输入
  iirArr：要输入的数组
  type：ANC工具类型，默认BES，BES不能用tab切换输入，可选（BES、wuqi、Airoda）
*/
const autoMove = (iirArr, type) => {
  // 获取鼠标位置
  var mouse = robot.getMousePos()
  const def = mouse.x
  let mouseX = mouse.x
  let mouseY = mouse.y
  let faq = []
  switch (type) {
    case 'BES':
      faq = freq2Gain(setTwoDimensionalArray(iirArr), 0, 1)
      for (let x = 0; x < faq.length; x++) {
        for (let y = 0; y < faq[0].length; y++) {
          if (y === 2) {
            mouseX += 80
          } else if (y === 1) {
            mouseX += 90
          }
          if (y === 2 && faq[x][y] <= 0.1) {
            faq[x][y] = 0.1
          }
          robot.moveMouse(mouseX, mouseY)
          robot.mouseClick()
          const input = String(Math.round(faq[x][y] * 100) / 100)
          robot.keyTap('a', 'control')
          clipboard.writeText(input)
          robot.keyTap('v', 'control')
        }
        mouseX = def
        // 30
        mouseY += 30
      }
      break
    case 'wuqi':
      faq = freq2Gain(setTwoDimensionalArray(iirArr), 0, 1)
      break
    case 'Airoha':
      faq = freq2Gain(setTwoDimensionalArray(iirArr), 1, 2)
      break
    case 'BES Config':
      faq = setTwoDimensionalArray(iirArr)
      for (let x = 0; x < faq.length; x++) {
        for (let y = 0; y < faq[0].length; y++) {
          if (y === 2) {
            mouseX += 80
          } else if (y === 1) {
            mouseX += 90
          }
          if (y === 2 && faq[x][y] <= 0.1) {
            faq[x][y] = 0.1
          }
          robot.moveMouse(mouseX, mouseY)
          robot.mouseClick()
          const input = String(Math.round(faq[x][y] * 100) / 100)
          robot.keyTap('a', 'control')
          clipboard.writeText(input)
          robot.keyTap('v', 'control')
        }
        mouseX = def
        // 30
        mouseY += 30
      }
      break
    case 'Lanxun': {
      const IIR = [
        [mouseX + 65, mouseY + 370],
        [mouseX + 65, mouseY + 400],
        [mouseX + 65, mouseY + 430]
      ]
      let X = mouseX
      let Y = mouseY
      faq = setTwoDimensionalArray(iirArr)
      for (let i = 0; i < faq.length; i++) {
        robot.moveMouse(X, Y)
        robot.mouseClick()
        for (let j = 0; j < faq[i].length; j++) {
          robot.moveMouse(IIR[j][0], IIR[j][1])
          robot.mouseClick()
          clipboard.writeText(String(Math.round(faq[i][j] * 100) / 100))
          robot.keyTap('v', 'control')
          robot.keyTap('enter')
        }
        if (i !== 3) {
          X += 35
        } else {
          X = mouseX
          Y += 35
        }
      }
      break
    }
  }
  if (!type.includes('BES') && type !== 'Lanxun') {
    console.log('sb')
    for (let x = 0; x < faq.length; x++) {
      for (let y = 0; y < faq[0].length; y++) {
        if (x === 0 && y === 0) {
          robot.moveMouse(mouseX, mouseY)
          robot.mouseClick()
        }
        if (y === 1 && faq[x][y] <= 0.1) {
          faq[x][y] = 0.1
        }
        let input = String(Math.round(faq[x][y] * 100) / 100)
        if (y === 0) {
          input = String(Math.round(input))
        }
        robot.keyTap('a', 'control')
        clipboard.writeText(input)
        robot.keyTap('v', 'control')
        if (y === 2) {
          robot.keyTap('tab')
          robot.keyTap('tab')
        }
        robot.keyTap('tab')
      }
    }
  }
  console.log('Mouse is at x:' + mouse.x + ' y:' + mouse.y)
}

export { autoMove }
