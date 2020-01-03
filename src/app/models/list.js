import { contains, empty, isEmpty, partialRight } from "ramda"

import Redis from "./redis"

const HEAD = "head"
const TAIL = "tail"
const LENGTH = "length"

const NEXT = "next"
const PREV = "prev"

const RESERVED = [HEAD, TAIL, LENGTH]

const int = partialRight(parseInt, [10])

export default class List {
  constructor(prefix) {
    this.redis = new Redis()
    this.prefix = prefix

    this.redis.set(`${this.prefix}:${LENGTH}`, 0)
  }

  async head() {
    const head = await this.redis.get(`${this.prefix}:${HEAD}`)

    return isEmpty(head) ? null : head
  }

  async tail() {
    const tail = await this.redis.get(`${this.prefix}:${TAIL}`)

    return isEmpty(tail) ? null : tail
  }

  async prev(item) {
    const prev = await this.redis.hget(`${this.prefix}:${item}`, PREV)

    return isEmpty(prev) ? null : prev
  }

  async next(item) {
    const next = await this.redis.hget(`${this.prefix}:${item}`, NEXT)

    return isEmpty(next) ? null : next
  }

  async length() {
    return int(await this.redis.get(`${this.prefix}:${LENGTH}`))
  }

  async push(item) {
    if (contains(item, RESERVED)) {
      return false
    }

    const key = `${this.prefix}:${item}`

    const tail = await this.tail()
    const length = await this.length()

    const transaction = this.redis.multi()
      .incr(`${this.prefix}:${LENGTH}`)
      .set(`${this.prefix}:${TAIL}`, item)
      .hset(key, [NEXT, "", PREV, tail || empty(new String())])

    if (length === 0) {
      transaction.set(`${this.prefix}:${HEAD}`, item)
    }

    if (tail !== null) {
      transaction.hset(`${this.prefix}:${tail}`, NEXT, item)
    }

    transaction.exec()
  }

  async remove(item) {
    if (contains(item, RESERVED)) {
      return false
    }

    const key = `${this.prefix}:${item}`

    const head = await this.head()
    const tail = await this.tail()

    const { next, prev } = await this.redis.hgetall(key)

    const transaction = this.redis.multi()
      .decr(`${this.prefix}:${LENGTH}`)
      .hset(`${this.prefix}:${prev}`, NEXT, next)
      .hset(`${this.prefix}:${next}`, PREV, prev)

    if (item === head) {
      transaction.set(`${this.prefix}:${HEAD}`, next)
    }

    if (item === tail) {
      transaction.set(`${this.prefix}:${TAIL}`, prev)
    }

    transaction.exec()
  }
}
