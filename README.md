# bughouse

A conceptually large scale chess experiment.

## Development

Services run in docker, application runs on host.

### Prerequisites:

- docker-compose
- nvm

### Setup

- `nvm install && nvm use`
- `npm install --global yarn`
- `POSTGRES_USER=$(whoami) docker-compose up`
- `createdb bughouse_development && yarn migrate`
- `createdb bughouse_test && NODE_ENV=test yarn migrate`

#### Run

- `yarn start`

Go to `localhost:3000`.
