# @znewton/fluid-app

A test fluid-app

## Getting Started

Install dependencies

```shell
yarn
```

Configure the app by copying `src/config/config.example.ts` as `src/config/config.ts`. Make any necessary configuration changes to this new file, such as fluidHost, tenantId, and tenantSecret.

```shell
cp src/config/config.example.ts src/config/config.ts
```

Start the app, then open it at http://localhost:8080, or wherever the output says it's listening:

```shell
yarn start
```

If you set everything up correctly and your fluid service is working as expected, you should be able to see an editable text box.
Open multiple windows/tabs with the same URL, and you should see changes propagate in real-time across the windows.
