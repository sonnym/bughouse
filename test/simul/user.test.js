import test from "ava"

import nock from "nock"

import User from "~/simul/user"

test("user creation", async t => {
  const cookie = "connect.sid=s%3AMbUlNkiim0jCMY_ZrakZXRWBFJSbEhaT.jMA5%2BScSwDNL3Lh5l1RIGyzWp0vwQNgtDMozgKosLQw"
  const setCookie = `${cookie}; Path=/; HttpOnly`

  nock("http://127.0.0.1:3000")
    .post("/users")
    .reply(201, null, { "set-cookie": setCookie })

  const { cookie: receivedCookie } = await User.create()

  t.is(cookie, receivedCookie)
})
