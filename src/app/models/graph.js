import { gql } from "apollo-server-express"

import { WHITE, BLACK } from "~/share/chess"

import Game from "~/app/models/game"

const typeDefs = gql`
  type Query {
    getGame(uuid: ID): ChessGame
  }

  type User {
    uuid: ID!
    displayName: String!
    rating: Int!
  }

  type ChessPlayer {
    color: String!
    user: User!
  }

  type ChessRevision {
    type: String!
    fen: String!
    move: String
  }

  type ChessGame {
    result: String!
    players: [ChessPlayer]!
    revisions: [ChessRevision]!
  }
`

const getGame = async (parent, { uuid }) => {
  const game = await Game
    .forge({ uuid })
    .fetch({ withRelated: [
      "revisions",
      "revisions.game",
      "revisions.position",

      "currentPosition",

      "whiteUser",
      "blackUser",

      "whiteUser.profile",
      "blackUser.profile",

      "whiteUser.rating",
      "blackUser.rating"
    ]
  })

  const out = {
    uuid: game.get("uuid"),
    result: game.get("result"),

    players: [
      { color: WHITE, user: game.related("whiteUser").serialize() },
      { color: BLACK, user: game.related("blackUser").serialize() }
    ],

    revisions: game.related("revisions").serialize()
  }

  return out
}

const resolvers = {
  Query: {
    getGame
  }
}

export default { typeDefs, resolvers }
