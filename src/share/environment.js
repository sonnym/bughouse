const environment = process.env.NODE_ENV || "development"

function isDevelopment() {
  return environment === "development"
}

export { environment, isDevelopment }
