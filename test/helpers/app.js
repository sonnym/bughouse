import startServer from "./../../src/app/index"

let n = 1000 + (process.pid * 2)

export default () => startServer(n++)
export const __useDefault = true
