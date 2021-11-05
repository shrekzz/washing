const robot = require('robotjs')
// Speed up the mouse.
// Get mouse position.

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
  return freq2Gain(listResult)
}
// 数据

const freq2Gain = arr => {
  for (var i = 0; i < arr.length; i++) {
    var temp = arr[i][0]
    arr[i][0] = arr[i][1]
    arr[i][1] = temp
  }
  return arr
}

const autoMove = iirArr => {
  // let mouseX = 220
  // let mouseY = 648
  const mouseX = 220
  const mouseY = 648
  const faq = setTwoDimensionalArray(iirArr)
  // for (let x = 0; x < faq.length; x++) {
  //   for (let y = 0; y < faq[0].length; y++) {
  //     if (y === 2) {
  //       mouseX += 80
  //     } else if (y === 1) {
  //       mouseX += 100
  //     }
  //     robot.moveMouse(mouseX, mouseY)
  //     robot.mouseClick()
  //     const input = String(faq[x][y])
  //     robot.keyTap('a', 'control')
  //     robot.typeString(input)
  //   }
  //   mouseX = 220
  //   // 30
  //   mouseY += 25
  // }

  for (let x = 0; x < faq.length; x++) {
    for (let y = 0; y < faq[0].length; y++) {
      if (x === 0 && y === 0) {
        robot.moveMouse(mouseX, mouseY)
        robot.mouseClick()
      }
      const input = String(faq[x][y])
      robot.keyTap('a', 'control')
      robot.typeString(input)
      if (y === 2) {
        robot.keyTap('tab')
        robot.keyTap('tab')
        robot.keyTap('tab')
      } else {
        robot.keyTap('tab')
      }
    }
  }
  // var mouse = robot.getMousePos()
  // console.log('Mouse is at x:' + mouse.x + ' y:' + mouse.y)
}

export { autoMove }
