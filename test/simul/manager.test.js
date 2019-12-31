import test from "ava"

import { spy } from "sinon"
import { forEach } from "ramda"

import Manager from "~/simul/manager"

class MockClient {
  constructor() {
    this.run = spy()
    this.close = spy()
  }
}

test.serial("run creates a new client and runs it", t => {
  const count = 3

  Manager.run(MockClient, count)

  t.is(Manager.clients.length, count)

  forEach(client => t.true(client.run.called), Manager.clients)
})

test.serial("end attempts to gracefully shutdown", t => {
  Manager.clients = Array.from(new Array(3), (_) => {
    return new MockClient()
  })

  Manager.end()

  forEach(client => t.true(client.close.called), Manager.clients)
})
