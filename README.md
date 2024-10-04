## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## run just the docker file in local
docker build --env-file .env -t myapp . docker run --env-file .env -p 3000:3000 myapp

## heroku add a new pack
heroku buildpacks:add jontewks/puppeteer
