import { Chess } from "chess.js"

const chess = new Chess()

export const WHITE = chess.WHITE
export const BLACK = chess.BLACK

export const PAWN = chess.PAWN
export const ROOK = chess.ROOK
export const KNIGHT = chess.KNIGHT
export const BISHOP = chess.BISHOP
export const QUEEN = chess.QUEEN
export const KING = chess.KING

export const STARTING_POSITION = chess.fen()
