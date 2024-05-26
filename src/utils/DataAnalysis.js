// const updateDataWithDeviations = (data) => {
//   // 函数用于计算所有点的最大值和最小值的平均值
//   const calculateAverageExtremes = data => {
//     const averageExtremes = []
//     data.forEach(item => {
//       // averageExtremes.push(item.slice(1).reduce((min, num) => num < min ? num : min, Infinity))
//       averageExtremes.push((item.slice(1).reduce((max, num) => num > max ? num : max, 0) + item.slice(1).reduce((min, num) => num < min ? num : min, Infinity)) / 2)
//     })
//     return averageExtremes
//   }
//   // 收集所有曲线的所有点
//   const averageExtremes = calculateAverageExtremes(data.slice(1))
//   // 更新数据数组，计算每条曲线的每个点与极值平均值的差
//   data.forEach((curve, index) => {
//     if (index === 0) return // 跳过标题行
//     curve.slice(1).forEach((value, j) => {
//       // 计算每个点与极值平均值的差，并替换原值
//       curve[j + 1] = value - averageExtremes[index - 1]
//     })
//   })
//   return data
// }

// export { updateDataWithDeviations }
const updateDataWithDeviations = (curvesData) => {
  // 函数用于计算每条曲线的最大值和最小值的平均值
  const calculateAverageExtremes = (curves) => {
    return curves.map(curve => {
      const max = Math.max(...curve.slice(1))
      const min = Math.min(...curve.slice(1))
      return (max + min) / 2
    })
  }

  // 计算每条曲线的极值平均值
  const averageExtremesPerCurve = calculateAverageExtremes(curvesData.slice(1))
  console.log(averageExtremesPerCurve)
  // 创建一个新的数据数组，避免直接修改原始数据
  // 更新数据数组，计算每条曲线的每个点与极值平均值的差
  const newData = curvesData.map((curve, index) => {
    if (index === 0) return curve // 保留标题行不变
    return [
      curve[0], // 保留曲线的标识符
      ...curve.slice(1).map(value => value - averageExtremesPerCurve[index - 1]) // 计算偏差
    ]
  })
  return newData
}

export { updateDataWithDeviations }
