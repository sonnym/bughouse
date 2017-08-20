import getLogger from "../../src/server/logger"

describe("logger", () => {
  it("is a singleton", () => {
    expect(getLogger()).toEqual(getLogger())
  })

  describe("in development environment", () => {
    let logger

    beforeAll(() => {
      process.env["ENV"] = "development"
      logger = getLogger()
    })

    it("has two streams", () => {
      expect(logger.streams.length).toBe(2)
    })
  })
})
