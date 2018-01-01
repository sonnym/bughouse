import mailer from "nodemailer"
import { merge } from "ramda"

import { logger } from "./../index"

const transporter = mailer.createTransport({ port: 25 })

export default class Mailer {
  static get defaults() {
    return { from: "no-reply@bughou.se" }
  }

  send(transporter = transporter) {
    transporter.sendMail(merge(this.opts, Mailer.defaults), (err, info) => {
      if (err) {
        logger.error(err)
      }

      if (info) {
        logger.info(info)
      }
    })
  }
}
