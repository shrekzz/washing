import log from 'electron-log'
log.transports.file.level = 'debug'
log.transports.file.maxSize = 1002430 // 10M
log.transports.console.level = 'silly'
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
let date = new Date()
date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
log.transports.file.resolvePath = () => 'D:\\WASHING_WORK\\' + date + '.log'
const logger = {
  info (param) {
    log.info(param)
  },
  warn (param) {
    log.warn(param)
  },
  error (param) {
    log.error(param)
  },
  debug (param) {
    log.debug(param)
  },
  verbose (param) {
    log.verbose(param)
  },
  silly (param) {
    log.silly(param)
  }
}
export { logger }
