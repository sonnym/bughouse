import logger from "../../src/server/logger"

describe("logger", () => {
  describe("in development environment", () => {
    beforeAll(() => {
      process.env["ENV"] = "development"
    })

    it("has one stream", () => {
      expect(logger.streams.length).toBe(1)
    })
  })
})
