const environment = process.env.NODE_ENV || "development"

function isDevelopment() {
  return environment === "development"
}

function isTest() {
  return environment === "test"
}

export { environment, isDevelopment, isTest }
