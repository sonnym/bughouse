import { RESERVE as type } from "~/share/constants/revision_types"

export default class Capture {
  constructor(universe, Revision) {
    this.universe = universe
    this.games = universe.games

    this.Revision = Revision
  }

  async process(source, piece) {
    const sourceUUID = source.get("uuid")
    const index = await this.findIndex(sourceUUID)

    let targetUUID

    if (toNext(index, piece)) {
      targetUUID = await this.universe.nextGame(sourceUUID)
    } else if (toPrev(index, piece)) {
      targetUUID = await this.universe.prevGame(sourceUUID)
    }

    const revision = await this.Revision.create({ type, source, targetUUID, piece })
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

function isWhite(piece) {
  return /[PRNBQK]/.test(piece)
}

function isBlack(piece) {
  return /[prnbqk]/.test(piece)
}

function toNext(index, piece) {
  return (isWhite(piece) && isEven(index)) || (isBlack(piece) && isOdd(index))
}

function toPrev(index, piece) {
  return (isWhite(piece) && isOdd(index)) || (isBlack(piece) && isEven(index) )
}
