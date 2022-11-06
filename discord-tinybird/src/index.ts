export interface Env {
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const discord_webhook_url = `https://discord.com/api/webhooks/1015225946804068452/${env.DISCORD_WEBHOOK_POSTS_CHANNEL_KEY}`;

		const body = await request.json();
		const message = {
			"username": "DataXP",
			"content": body.attachments[0].title_link
		};

		fetch(discord_webhook_url, {
			method: 'POST', body: JSON.stringify(message), headers: {
				'Content-Type': 'application/json',
				"Access-Control-Allow-Origin": "*",
			},
		});

		fetch(
			'https://api.tinybird.co/v0/events?name=events',
			{
				method: 'POST',
				body: JSON.stringify({
					date: new Date().toISOString(),
					site: 'dataxp.io',
					type: 'blog_post',
					owner: 'self',
					link: body.attachments[0].title_link
				}),
				headers: { Authorization: `Bearer ${env.TINYBIRD_EVENTS_KEY}` }
			}
		);

		return new Response(null, { status: 200 });
	},
};
