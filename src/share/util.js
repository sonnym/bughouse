import { partialRight } from "ramda"

export const int = partialRight(parseInt, [10])
export const sample = array => {
  return array[Math.floor(Math.random() * array.length)]
}
