'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Send } from 'lucide-react'

export default function Home() {
	const [messages, setMessages] = useState([{ id: 1, role: 'ai', content: 'Opa, em que posso ser ajudar?' }])
	const [input, setInput] = useState('')

	const handleInputChange = (e: { target: { value: string } }) => {
		setInput(e.target.value)
	}

	const messagesEndRef = useRef<null | HTMLDivElement>(null)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault()

		if (input.trim() === '') return

		const userMessage = {
			id: messages.length + 1,
			role: 'user',
			content: input
		}

		setMessages(prevMessages => [...prevMessages, userMessage])
		setInput('')

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ prompt: input })
			})

			if (!res.ok) {
				throw new Error('Failed to fetch from the API')
			}

			const reader = res.body?.getReader()
			const decoder = new TextDecoder()

			let aiMessage = { id: messages.length + 2, role: 'ai', content: '' }
			setMessages(prevMessages => [...prevMessages, aiMessage])

			while (true) {
				const { done, value } = await reader?.read()!

				if (done) break

				const chunk = decoder.decode(value, { stream: true })
				aiMessage.content += chunk

				setMessages(prevMessages => {
					const updatedMessages = [...prevMessages]
					updatedMessages[updatedMessages.length - 1] = aiMessage
					return updatedMessages
				})
			}
		} catch (error) {
			console.error('Error:', error)
			setTimeout(() => {
				setMessages(prevMessages => [
					...prevMessages,
					{ id: prevMessages.length + 1, role: 'ai', content: 'Erro na resposta' }
				])
			}, 3000)
		}
	}

	return (
		<div className="flex flex-col gap-2 items-center justify-center bg-zinc-950 min-h-screen">
			<Card className="lg:w-[340px] sm:w-full bg-zinc-900 border-none">
				<CardHeader className="border-b border-zinc-600/20">
					<CardTitle className="text-white">Nathan, we have a problem.</CardTitle>
					<CardDescription>Ask me anything...</CardDescription>
				</CardHeader>
				<CardContent>
					<ScrollArea ref={messagesEndRef} className="h-[600px] w-full space-y-4 pr-6">
						{messages.map(message => (
							<div
								key={message.id}
								className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
							>
								{message.role === 'ai' && (
									<Avatar className="mr-2">
										<AvatarImage src="https://github.com/nathanpalatin.png" alt="AI Avatar" />
										<AvatarFallback>AI</AvatarFallback>
									</Avatar>
								)}
								<div
									className={`py-2 px-4 rounded-lg text-sm ${
										message.role === 'user' ? 'bg-zinc-500 text-white' : 'bg-gray-700 text-white'
									}`}
								>
									{message.content}
								</div>
							</div>
						))}
					</ScrollArea>
				</CardContent>
				<CardFooter>
					<form className="flex gap-2 w-full" onSubmit={handleSubmit}>
						<Input
							className="w-full text-zinc-100 bg-zinc-700 border-none placeholder:text-zinc-500"
							onChange={handleInputChange}
							value={input}
							placeholder="Say something..."
						/>
						<Button disabled={input.length === 0} className="bg-zinc-800 shadow-sm" type="submit">
							<Send className={'text-zinc-400 size-5'} />
						</Button>
					</form>
				</CardFooter>
			</Card>
		</div>
	)
}
