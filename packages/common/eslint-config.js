module.exports = {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "@typescript-eslint",
        "prettier"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    "rules": {
        "prettier/prettier": 2,
        "@typescript-eslint/no-explicit-any": 0
    },
    "env": {
        "browser": false
    }
}
