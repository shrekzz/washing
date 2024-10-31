const SerialPort = require('serialport').SerialPort
let list
const a = () => {
  SerialPort.list().then((ports) => {
    list = ports
  }).catch((err) => {
    console.log(err)
  })
}

