# @znewton/stress

A small stress testing CLI tool.

# Usage

```shell
# Send 5 requests to given url with 200ms between each
node dist/index.js --url http://localhost:3003/api/v1/ping --numRequests 5 --delayInMs 200
```

```shell
# Send 100 requests to url with 5ms between each, output status result of each request
node dist/index.js -u http://localhost:3000 -n 100 -d 5 -v
```
