# @znewton/common

A collection of common configurations for the `pkgs` project.

# eslint

`eslintrc`:

```json
{
    "extends": [
        "./node_modules/@znewton/common/eslint-config.js"
    ]
}
```

# prettier

`package.json`:

```json
{
  "prettier": "@znewton/common/prettier-config.json"
}
```

# typescript

`tsconfig.json`:

```json
{
    "extends": "@znewton/common/ts-config.json",
    "exclude": [
        "dist",
        "node_modules"
    ],
    "compilerOptions": {
        "rootDir": "./src",
        "outDir": "./dist",
    },
    "include": [
        "src/**/*"
    ]
}
```
