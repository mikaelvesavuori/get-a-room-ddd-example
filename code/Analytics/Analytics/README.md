# `SlotAnalytics`

This codebase encompasses the Slot Analytics bounded context, part of the Analytics domain.

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

Run `npm test` or `yarn test`. Unit tests are written with [ava](https://github.com/avajs/ava) and stored in the `__tests__` folder.

## Generate documentation

To generate documentation, run `npm run docs` or `yarn docs`. Now you can view documentation of various kinds in the `docs/` folder.

## Deployment

Run `npm run deploy` or `yarn deploy`.

## Remove stack

Run `npm run teardown` or `yarn teardown`.
