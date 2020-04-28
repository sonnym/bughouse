import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"

import { identity } from "ramda"

import { isTest } from "~/share/environment"

const fetch = isTest() ? identity : window.fetch.bind(fetch)

const cache = new InMemoryCache()
const link = new HttpLink({
  uri: "http://localhost:3000/graphql",
  fetch
})

const client = new ApolloClient({ cache, link })

export default client.query.bind(client)
