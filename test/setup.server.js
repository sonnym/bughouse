const babelRegister = require("@babel/register")
babelRegister({ only: ["src", "test"] })

const test = require("ava")
const sinon = require("sinon")

test.afterEach.always(() => {
  sinon.restore()
})
