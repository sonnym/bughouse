import { v4 } from "uuid"
import { identity } from "ramda"

import List from "~/app/models/list"

import Game from "~/app/models/game"
import User from "~/app/models/user"

export default class Factory {
  static async game({ fen, result } = { }) {
    const game = await Game.create(
      await User.create({
        email: `${v4()}@example.com`,
        password: v4(),
        displayName: v4()
      }),

      await User.create({
        email: `${v4()}@example.com`,
        password: v4(),
        displayName: v4()
      })
    )

    if (fen) {
      await game.refresh({ withRelated: ["currentPosition"] })
      await game.related("currentPosition").set({ m_fen: fen }).save()
    }

    if (result) {
      await game.set({ result }).save()
    }

    return game
  }

  static async list(size) {
    const list = new List(v4())

    for (let i = 0; i < size; i++) {
      await list.push(v4())
    }

    return list
  }

  static async user(email, password, displayName) {
    return await User.create({
      email: email || `${v4()}@example.com`,
      password: password || v4(),
      displayName: displayName || v4()
    })
  }

  static redis() {
    return {
      subscribeAsync: identity,
      end: identity
    }
  }

  static req(params) {
    return { params }
  }

  static res(t, expectedStatus, expectedJSON) {
    return {
      end: identity,
      status: actualStatus => {
        t.is(expectedStatus, actualStatus)

        return {
          send: async (actualJSON) => {
            if (!expectedJSON) {
              return
            }

            t.deepEqual(actualJSON, expectedJSON)
          },
          end: identity
        }
      }
    }
  }

  static next(t) {
    return t.log.bind(t)
  }
}