import test from "ava"

import { spy } from "sinon"
import { v4 } from "uuid"

import { RESULT } from "~/share/constants/game_update_types"

import RedisMediator from "~/app/models/redis_mediator"

test.todo("sendPosition")

test("sendResult: sends over the socket", t => {
  const send = spy()
  const socket = { send }

  const redisMediator = new RedisMediator(socket)

  const uuid = v4()
  const result = v4()

  redisMediator.sendResult({ uuid, result })

  t.true(send.calledOnceWith({
    action: RESULT,
    uuid,
    result
  }))
})
