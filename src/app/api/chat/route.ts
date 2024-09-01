import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	const { message } = await request.json()

	const botResponse = `Opa! Muito prazer ${message}. Em que posso ajudar-lo?`

	return NextResponse.json({ response: botResponse })
}
