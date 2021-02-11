# @znewton/telemetry-server

A Telemetry Server that can receive client logs and store them for future analysis.

## Getting Started

Install dependencies

```shell
yarn
```

Configure the app by copying `src/config/config.example.ts` as `src/config/config.ts`. Make any necessary configuration changes to this new file, such as enabling a logger.

```shell
cp src/config/config.example.ts src/config/config.ts
```

Start the app

```shell
yarn start:dev
```

If you set everything up correctly, sending a post request to `http://localhost:6060` should save the request body as a log via whatever logger was enabled in the config.
