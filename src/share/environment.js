const environment = process.env.NODE_ENV || "development"

function isProduction() {
  return environment === "production"
}

function isDevelopment() {
  return environment === "development"
}

function isTest() {
  return environment === "test"
}

export { environment, isProduction, isDevelopment, isTest }
