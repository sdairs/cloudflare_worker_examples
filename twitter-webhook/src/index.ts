export interface Env {
}

export default {


	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {

		if (request.method === 'POST') {
			// https://developer.twitter.com/en/docs/twitter-api/premium/account-activity-api/guides/account-activity-data-objects
			const body = await request.json();
			let payload = {};
			payload.for_user_id = body.for_user_id;
			payload.event_ts = new Date().toISOString();
			payload.original_event = JSON.stringify(body);

			if ('follow_events' in body) {
				// Follow event
				payload.event_type = 'follow_events';
			} else if ('tweet_create_events' in body) {
				// Tweets, Retweets, Replies, QuoteTweets
				payload.event_type = 'tweet_create_events';
				if ('user_has_blocked' in body) {
					// @mentions
					payload.event_type = 'tweet_create_events_mention';
				}
			} else if ('favorite_events' in body) {
				// Likes
				payload.event_type = 'favorite_events';
			} else if ('unfollow_events' in body) {
				payload.event_type = 'unfollow_events';
			} else if ('block_events' in body) {
				payload.event_type = 'block_events';
			} else if ('unblock_events' in body) {
				payload.event_type = 'unblock_events';
			} else if ('mute_events' in body) {
				payload.event_type = 'mute_events';
			} else if ('unmute_events' in body) {
				payload.event_type = 'unmute_events';
			} else if ('user_event' in body) {
				payload.event_type = 'user_event';
			} else if ('direct_message_events' in body) {
				payload.event_type = 'direct_message_events';
			} else if ('direct_message_indicate_typing_events' in body) {
				payload.event_type = 'direct_message_indicate_typing_events';
			} else if ('direct_message_mark_read_events' in body) {
				payload.event_type = 'direct_message_mark_read_events';
			} else if (' tweet_delete_events' in body) {
				payload.event_type = 'tweet_delete_events';
			}

			fetch(
				'https://api.tinybird.co/v0/events?name=twitter_events',
				{
					method: 'POST',
					body: JSON.stringify(payload),
					headers: { Authorization: `Bearer ${env.TINYBIRD_TWITTER_EVENTS_AUTH_TOKEN}` }
				}
			);

			return new Response('Response for POST');
		}
		else if (request.method === 'GET') {
			const consumer_secret = env.TWITTER_CONSUMER_SECRET;
			const { searchParams } = new URL(request.url);
			let crc_token = searchParams.get('crc_token');

			if (crc_token == null) return new Response("Must provide a CRC Token", { status: 400 });

			let digest = await (async () => {
				'use strict';

				let secret = consumer_secret;
				let enc = new TextEncoder("utf-8");
				let body = crc_token;
				let algorithm = { name: "HMAC", hash: "SHA-256" };

				let key = await crypto.subtle.importKey("raw", enc.encode(secret), algorithm, false, ["sign", "verify"]);
				let signature = await crypto.subtle.sign(algorithm.name, key, enc.encode(body));
				let digest = btoa(String.fromCharCode(...new Uint8Array(signature)));

				return digest;
			})();
			return new Response(JSON.stringify({ "response_token": `sha256=${digest}` }));
		}
		return new Response("Nope", { status: 405 });
	},
};
