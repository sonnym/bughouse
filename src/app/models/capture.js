import { WHITE, BLACK } from "~/share/constants/chess"

import Revision from "~/app/models/revision"

export default class Capture {
  constructor({ games }) {
    this.games = games
  }

  async process(source, color, piece) {
    const sourceUUID = source.get("uuid")
    const index = await this.findIndex(sourceUUID)

    let targetUUID

    if (toNext(index, color, piece)) {
      targetUUID = await this.games.after(sourceUUID)
    } else if (toPrev(index, color, piece)) {
      targetUUID = await this.games.before(sourceUUID)
    }

    const revision = await Revision.reserve(source, targetUUID, color, piece)
    await revision.refresh({ withRelated: ["position"] })

    const position = revision.related("position")

    return { uuid: targetUUID, position }
  }

  async findIndex(uuid) {
    let index = 0, node = await this.games.head()

    while (node && node !== uuid) {
      node = await this.games.next(node)
      index++
    }

    return index
  }
}

function isEven(n) {
  return n % 2 === 0
}

function isOdd(n) {
  return n % 2 !== 0
}

function toNext(index, color, piece) {
  return (color === WHITE && isEven(index)) || (color === BLACK && isOdd(index))
}

function toPrev(index, color, piece) {
  return (color === WHITE && isOdd(index)) || (color === BLACK && isEven(index) )
}
