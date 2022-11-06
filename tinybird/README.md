# Tinybird

This example shows you how to forward an incoming request to [Tinybird](https://tinybird.co) for analytics.

Tinybird is a scalable, serverless analytics platform built ontop of the open-source ClickHouse project.

We capture an event and simply use standard JavaScript `fetch` to POST our event to the Tinybird Events API.
