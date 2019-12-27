import { request } from "http"

import { v4 } from "uuid"

export default class User {
  static async create() {
    const userData = {
      email: `${v4()}@example.com`,
      password: v4(),
      displayName: v4()
    }

    const postData = JSON.stringify(userData)
    const options = {
      method: "POST",
      host: "127.0.0.1",
      port: "3000",
      path: "/users",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData)
      }
    }

    return new Promise((resolve, reject) => {
      const req = request(options, (res) => {
        if (res.statusCode === 201) {
          const cookie = res.headers["set-cookie"][0].split(";")[0]

          resolve({ cookie })
        }
      })

      req.on("error", reject)

      req.write(postData)
      req.end()
    })
  }
}
