
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
// 平均值
const calculateColumnAverages = array2D => {
  const columns = array2D[0].length
  const columnSums = new Array(columns).fill(0)

  array2D.forEach(row => {
    for (let i = 0; i < columns; i++) {
      columnSums[i] += row[i]
    }
  })

  const columnAverages = columnSums.map(sum => sum / array2D.length)

  return columnAverages
}

// 最大值
const findColumnMaxima = array2D => {
  const columns = array2D[0].length
  const columnMaxima = []

  for (let col = 0; col < columns; col++) {
    // 使用扩展运算符和Math.max获取每一列的最大值
    columnMaxima.push(Math.max(...array2D.map(row => row[col])))
  }

  return columnMaxima
}
// 最小值
const findColumnMinima = array2D => {
  const columns = array2D[0].length
  const columnMinima = []

  for (let col = 0; col < columns; col++) {
    // 使用扩展运算符和Math.min获取每一列的最小值
    columnMinima.push(Math.min(...array2D.map(row => row[col])))
  }

  return columnMinima
}
// 标准差
const calculateColumnSTD = (array2D, AVG) => {
  const columns = array2D[0].length
  const columnSTDs = []

  for (let col = 0; col < columns; col++) {
    const colValues = array2D.map(row => row[col])
    // 使用已有的平均值
    const mean = AVG[col]
    const variance = colValues.reduce((acc, val) => acc + (val - mean) ** 2, 0) / colValues.length
    const stdDev = Math.sqrt(variance)
    columnSTDs.push(stdDev)
  }

  return columnSTDs
}
// Ca
const calculateCa = (USL, LSL, AVG) => {
  const CaValues = USL.map((usl, index) => {
    const lsl = LSL[index]
    const avg = AVG[index]
    const U = (usl + lsl) / 2 // 规格中心值
    const T = usl - lsl // 规格公差
    // Ca值计算公式
    // const Ca = Math.abs(avg - U) / (T / 2)
    const Ca = Math.abs(avg - U) / (T / 2)
    return Ca * 0
  })

  return CaValues
}

// Cp
const calculateCp = (USL, LSL, STD) => {
  const CpValues = USL.map((usl, index) => {
    const lsl = LSL[index]
    const std = STD[index]
    const T = usl - lsl // 规格公差
    // Cp值计算公式
    const Cp = T / (6 * std)
    return Cp
  })

  return CpValues
}
// Cpk
const calculateCPK = (Ca, Cp) => {
  const CPKValues = Ca.map((ca, index) => {
    // 计算CPK值
    // const cpk = Math.min(Cp[index], (1 / (1 + (ca ** 2))))
    const cpk = Cp[index] * (1 - Math.abs(Ca[index]))
    return cpk
  })

  return CPKValues
}

// total
const calculateUSLLSLDifferences = (USL, LSL) => {
  // 计算差值数组
  const differenceArray = USL.map((usl, index) => Math.round((usl - LSL[index]) / 2))
  // 计算差值的相反数数组
  const negativeDifferenceArray = USL.map((usl, index) => Math.round((LSL[index] - usl) / 2))
  console.log(differenceArray)
  console.log(negativeDifferenceArray)
  return { differenceArray, negativeDifferenceArray }
}

const updateDataWithCPK = (curvesData) => {
  console.log(curvesData)
  const USL = curvesData[1].slice(1)
  const LSL = curvesData[2].slice(1)
  const startIdx = USL.slice(1).findIndex((element) => {
    return element != null && element !== '' && element !== false && element !== 0
  }) + 1
  const endIdx = USL.length
  function extractSubArray2D(array2D, startIndex, endIndex) {
    // 使用map方法遍历每一行，并截取每一行的子数组
    return array2D.map(row => {
      // 使用slice方法截取每一行的子数组
      return row.slice(startIndex, endIndex + 1)
    })
  }

  const data = extractSubArray2D(curvesData.slice(3), startIdx, endIdx)
  const AVG = calculateColumnAverages(data)
  const MAX = findColumnMaxima(data)
  const MIN = findColumnMinima(data)
  const STD = calculateColumnSTD(data, AVG)
  const { differenceArray, negativeDifferenceArray } = calculateUSLLSLDifferences(USL, LSL)
  const Ca = calculateCa(USL, LSL, AVG)
  const Cp = calculateCp(USL, LSL, STD)
  const Cpk = calculateCPK(Ca, Cp)
  const res = [
    ...curvesData,
    [],
    ['AVG', ...AVG],
    ['MAX', ...MAX],
    ['MIN', ...MIN],
    ['STD', ...STD],
    ['+Tol', ...differenceArray],
    ['-Tol', ...negativeDifferenceArray],
    ['Ca', ...Ca],
    ['Cp', ...Cp],
    ['Cpk', ...Cpk]
  ]
  return res
}

export { updateDataWithDeviations, updateDataWithCPK }
