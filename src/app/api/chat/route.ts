import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	const { prompt } = await req.json()

	if (!prompt) {
		return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
	}

	const apiKey = process.env.OPENAI_API_KEY

	if (!apiKey) {
		return NextResponse.json({ error: 'API key is missing' }, { status: 500 })
	}

	try {
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'system',
						content:
							'Aja de uma forma amigável, voce é um mestre dos magos de uma empresa chamada Montvenue e que saiba tudo sobre investimentos e tanto no Brasil e exterior e pelo que está acontecendo hoje no mundo com investimentos, voce vai conversar com uma pessoa chamada Doug.'
					},
					{ role: 'user', content: prompt }
				],
				stream: true
			})
		})

		const readableStream = new ReadableStream({
			async start(controller) {
				const decoder = new TextDecoder()
				const reader = response.body?.getReader()

				if (!reader) {
					controller.error('Error starting stream')
					return
				}

				while (true) {
					const { done, value } = await reader.read()
					if (done) break

					const chunk = decoder.decode(value, { stream: true })
					const lines = chunk.split('\n').filter(line => line.trim() !== '')

					for (const line of lines) {
						if (line === 'data: [DONE]') {
							controller.close()
							return
						}

						try {
							const json = JSON.parse(line.replace(/^data: /, ''))
							const content = json.choices[0]?.delta?.content || ''

							if (content) {
								controller.enqueue(new TextEncoder().encode(content))
							}
						} catch (error) {
							console.error('Error parsing JSON', error)
						}
					}
				}
			}
		})

		return new Response(readableStream, {
			headers: { 'Content-Type': 'text/event-stream' }
		})
	} catch (error) {
		console.error('Error:', error)
		return NextResponse.json({ error: 'Failed to fetch from OpenAI API' }, { status: 500 })
	}
}
