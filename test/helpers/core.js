import { partialRight } from "ramda"

export const int = partialRight(parseInt, [10])
