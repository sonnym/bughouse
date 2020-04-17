import { connection } from "~/server/database"

import User from "~/app/models/user"

export const create = async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    await user.refresh({ withRelated: ["profile", "rating"] })

    req.login(user, (err) => {
      if (err) next(err)

      res.status(201).send(user.serialize())
    })
  } catch(err) {
    res.status(400).end()
    next(err)
  }
}

export const show = async ({ params }, res, next) => {
  try {
    const user = await User
      .forge({ uuid: params.uuid })
      .fetch({ withRelated: ["profile", "rating"] })

    res.status(200).send(user.serialize())
  } catch(err) {
    res.status(404).end()
    next(err)
  }
}

export const index = async({ params }, res, next) => {
  const ratingQuery = connection
    .select("value")
    .from("ratings")
    .whereRaw("ratings.user_id = users.id")
    .orderBy("created_at", "DESC")
    .limit(1)
    .as("rating")

  try {
    const users = await User
      .forge()
      .query(qb => {
        qb.select("users.*", ratingQuery).orderByRaw("rating DESC")
      })
      .fetchPage({ withRelated: ["profile"] })

    res.status(200).send(users.serialize())
  } catch(err) {
    res.status(500).end()
    next(err)
  }
}
