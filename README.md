# bughouse

A conceptually large scale chess experiment.

## Development

Services run in docker, application runs on host.

### Prerequisites:

- docker-compose
- nvm

### Setup

- `nvm install && nvm use`
- `POSTGRES_USER=$(whoami) docker-compose up`
- `createdb bughouse_development && npm migrate`
- `createdb bughouse_test && NODE_ENV=test npm migrate`

#### Run

- `npm start`

Go to `localhost:3000`.
