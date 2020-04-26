import { maxBy, partial, partialRight } from "ramda"

export const int = partialRight(parseInt, [10])
export const sample = partial(maxBy, [Math.random])
