module.exports = {
  pipeline: {
    build: ["^build"],
    clean: [],
    test: ["^build"],
    lint: ["^build"],
    "lint:fix": ["build"],
    publish: ["^build", "build", "test", "lint"],
  },
};