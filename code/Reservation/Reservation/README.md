# `SlotReservation`

This codebase encompasses the Slot Reservation bounded context, part of the Reservation domain.

## Prerequisites

- You have a recent Node version, ideally version 18 or later
- You have an AWS account
- You have sufficient AWS credentials to deploy the required infrastructure (including API Gateway, Lambda, S3 and more)
- You are logged into AWS in your environment
- In `serverless.yml`, you have set `custom.config.awsAccountNumber` to your AWS account number

## Install

Run `npm install` or `yarn install`.

## Local development

Run `npm start` or `yarn start`.

## Test

Run `npm test` or `yarn test` to run all tests.

The command for unit tests is `npm|yarn run test:unit`. The command for integration tests is `npm|yarn run test:integration`.

Note that you will need to have the `INTEGRATION_ENDPOINT_BASE` value set in the integration script (`__tests__/integration/index.ts`) as well as (logically) some infrastructure up and running that you can test with. Ideally you do the integration testing on a separate test stack during CI and then tear it down before deploying the production stack (given that the tests run, of course!).

Unit tests are written with [ava](https://github.com/avajs/ava) and stored in the `__tests__/unit` folder. Integration tests are stored under `__tests__/integration` and are manually constructed using [ajv](https://ajv.js.org) and [cross-fetch](https://www.npmjs.com/package/cross-fetch) as dependencies.

## Generate documentation

To generate documentation, run `npm run docs` or `yarn docs`. Now you can view documentation of various kinds in the `docs/` folder.

## Deployment

## Deployment

You will need to make two deployments.

1. The first deployment is to set up the infrastructure.
2. The second deployment will need to happen with the API Gateway random default endpoint ID known and set in `serverless.yml` under `custom.aws.securityApiGatewayRandomString`.

Run `npm run deploy` or `yarn deploy`.

## Remove stack

Run `npm run teardown` or `yarn teardown`.
