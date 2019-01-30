import test from "ava"
import { mock } from "sinon"

import Mailer from "~/app/mailers/base"

test("static defaults attribute", t => {
  t.is(Mailer.defaults.from, "no-reply@bughou.se")
})

test("send instance method", t => {
  const transporter = { sendMail: () => {} }
  const mockTransporter = mock(transporter)
  mockTransporter.expects("sendMail").once()

  new Mailer().send(transporter)

  mockTransporter.verify()

  t.pass()
})
