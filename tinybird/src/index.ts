export interface Env {
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const body = await request.json();

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
