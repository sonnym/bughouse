import EventEmitter from "events"

import { forEach } from "ramda"

import Chess, { BLACK, WHITE } from "~/share/chess"

import { MOVE, RESERVE, DROP, RESIGN, FORFEIT } from "~/share/constants/revision_types"
import { WHITE_WIN, BLACK_WIN } from "~/share/constants/results"

import Model, { transaction } from "./base"

import Game from "./game"
import Position from "./position"
import Rating from "./rating"

const emitter = new EventEmitter()

export default class Revision extends Model {
  get tableName() {
    return "revisions"
  }

  get hasTimestamps() {
    return true
  }

  game() {
    return this.belongsTo(Game)
  }

  position() {
    return this.belongsTo(Position)
  }

  static on(eventName, callback) {
    emitter.on(eventName, callback)
  }

  static async [MOVE](uuid, color, moveData) {
    const game = await new Game({ uuid: uuid }).fetch({
      withRelated: ["currentPosition", "whiteUser", "blackUser"]
    })

    const currentPosition = game.related("currentPosition")
    const initialFen = currentPosition.get("bfen")

    const chess = new Chess(initialFen)

    if (!chess.isValidMove({ ...moveData, color })) {
      return false
    }

    const move = chess.move(moveData)

    const position = new Position({
      bfen: chess.bfen,
      white_reserve: currentPosition.get("white_reserve"),
      black_reserve: currentPosition.get("black_reserve"),
      move_number: currentPosition.get("move_number") + 1,
    })

    const revision = await transaction(async transacting => {
      await position.save(null, { transacting })

      const revision = new Revision({
        game_id: game.get("id"),
        source_game_id: game.get("id"),
        position_id: position.get("id"),
        type: MOVE,
        move
      })

      if (chess.isGameOver()) {
        await setGameResult(game, chess.result, transacting)
      }

      await revision.save(null, { transacting })

      return revision
    })

    emitter.emit("create", revision)

    return revision
  }

  // TODO: exit early if game is over
  static async [RESERVE](source, targetUUID, color, piece) {
    const target = await new Game({ uuid: targetUUID }).fetch({
      withRelated: ["currentPosition"]
    })

    const currentPosition = target.related("currentPosition")

    const bfen = currentPosition.get("bfen")

    const position = new Position({
      bfen,

      white_reserve: color === WHITE ?
        incrPiece(currentPosition.get("white_reserve"), piece) :
        currentPosition.get("white_reserve"),

      black_reserve: color === BLACK ?
        incrPiece(currentPosition.get("white_reserve"), piece) :
        currentPosition.get("black_reserve"),

      move_number: currentPosition.get("move_number") + 1,
    })

    const revision = await transaction(async transacting => {
      await position.save(null, { transacting })

      const revision = new Revision({
        type: RESERVE,
        game_id: target.get("id"),
        source_game_id: source.get("id"),
        position_id: position.get("id")
      })

      await revision.save(null, { transacting })

      return revision
    })

    emitter.emit("create", revision)

    return revision
  }

  static async [DROP](uuid, color, piece, coords) {
    const game = await new Game({ uuid }).fetch({
      withRelated: ["currentPosition"]
    })

    const currentPosition = game.related("currentPosition")
    const reserve = color === WHITE ?
      currentPosition.get("white_reserve") :
      currentPosition.get("black_reserve")

    const chess = new Chess(currentPosition.get("bfen"))

    if (reserve[piece] === 0 || !chess.isValidDrop({ piece, color, coords })) {
      return false
    }

    chess.drop(piece, color, coords)

    const position = new Position({
      bfen: chess.bfen,
      white_reserve: color === WHITE ? decrPiece(reserve, piece) : currentPosition.get("white_reserve"),
      black_reserve: color === BLACK ? decrPiece(reserve, piece) : currentPosition.get("black_reserve"),
      move_number: currentPosition.get("move_number") + 1
    })

    const revision = await transaction(async transacting => {
      await position.save(null, { transacting })

      const revision = new Revision({
        type: DROP,
        move: { piece, coords },
        game_id: game.get("id"),
        source_game_id: game.get("id"),
        position_id: position.get("id")
      })

      if (chess.isGameOver()) {
        await setGameResult(game, chess.result, transacting)
      }

      await revision.save(null, { transacting })

      return revision
    })

    emitter.emit("create", revision)

    return revision
  }

  static async [FORFEIT](uuid, user) {
    const game = await new Game({ uuid }).fetch({
      withRelated: ["currentPosition", "whiteUser", "blackUser"]
    })

    const revision = new Revision({
      type: FORFEIT,
      game_id: game.get("id"),
      source_game_id: game.get("id"),
      position_id: game.related("currentPosition").get("id")
    })

    await transaction(async transacting => {
      if (user.get("uuid") === game.related("whiteUser").get("uuid")) {
        await setGameResult(game, BLACK_WIN, transacting)
      } else if (user.get("uuid") === game.related("blackUser").get("uuid")) {
        await setGameResult(game, WHITE_WIN, transacting)
      }

      await revision.save(null, { transacting })
    })

    emitter.emit("create", revision)

    return revision
  }

  static async [RESIGN](uuid, color) {
    const revision = await transaction(async transacting => {
      const game = await new Game({ uuid }).fetch({
        transacting,
        withRelated: ["currentPosition", "whiteUser", "blackUser"]
      })

      const revision = new Revision({
        type: RESIGN,
        game_id: game.get("id"),
        source_game_id: game.get("id"),
        position_id: game.related("currentPosition").get("id")
      })

      if (color === WHITE) {
        await setGameResult(game, BLACK_WIN, transacting)
      } else if (color === BLACK) {
        await setGameResult(game, WHITE_WIN, transacting)
      }

      await revision.save(null, { transacting })
    })

    emitter.emit("create", revision)

    return revision
  }

  serialize() {
    let moveText = ""

    const type = this.get("type")
    const move = this.get("move")

    if (type === MOVE) {
      moveText = move.san
    } else if (type === DROP) {
      moveText = `${move.piece.toUpperCase()}@${move.coords}`
    }

    return {
      type,
      move: moveText,
      gameUUID: this.related("game").get("uuid"),
      position: this.related("position").serialize()
    }
  }
}

async function setGameResult(game, result, transacting) {
  game.set("result", result)

  await game.save(null, { transacting })

  forEach(async (rating) => {
    await rating.save(null, { transacting })
  }, await Rating.calculate(game))
}

function incrPiece(reserve, piece) {
  reserve[piece]++

  return reserve
}

function decrPiece(reserve, piece) {
  reserve[piece]--

  return reserve
}
