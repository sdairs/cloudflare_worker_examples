# Discord Tinybird

This example captures an incoming request to forward it to a Discord channel & captures the event in [Tinybird](https://tinybird.co) for analytics.

Blog publishing platforms like [Ghost](https://ghost.org/) allow you trigger a webhook when you publish posts. You can this Cloudflare Worker 
to handle these webhooks. In this case, we capture the publish event and send the post link to a Discord channel. We also want to be able to do some 
analytics over the events, so we forward the event to Tinybird. Using Tinybird, we can combine these events with our [Web Analytics](https://www.tinybird.co/starter-kits/web-analytics) 
to create a rich timeline that shows how our activity affects web traffic.
