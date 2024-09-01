'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Send } from 'lucide-react'

export default function Home() {
	const [messages, setMessages] = useState([
		{
			id: 1,
			role: 'ai',
			content: 'Olá, boa tarde! qual seu nome?'
		}
	])
	const [input, setInput] = useState('')
	const [typingMessage, setTypingMessage] = useState('')
	const [isTyping, setIsTyping] = useState(false)

	const handleInputChange = (e) => {
		setInput(e.target.value)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (input.trim() === '') return

		const userMessage = {
			id: messages.length + 1,
			role: 'user',
			content: input,
		}

		setMessages((prevMessages) => [...prevMessages, userMessage])
		setInput('')

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ message: input }),
			})

			const data = await response.json()
			setTypingMessage(data.response)
			setMessages((prevMessages) => [...prevMessages, { id: prevMessages.length + 1, role: 'ai', content: typingMessage }])
			setIsTyping(true)

		} catch (error) {
			console.error('Error:', error)
		}
	}

	useEffect(() => {
		if (!isTyping) return

		const typingInterval = setInterval(() => {
			setMessages((prevMessages) => {
				const lastMessage = prevMessages[prevMessages.length - 1]
				if (lastMessage && lastMessage.role === 'ai') {
					if (lastMessage.content.length < typingMessage.length) {
						const newContent = typingMessage.slice(0, lastMessage.content.length + 1)
						return [
							...prevMessages.slice(0, -1),
							{ ...lastMessage, content: newContent }
						]
					} else {
						clearInterval(typingInterval)
						setIsTyping(false)
					}
				}
				return prevMessages
			})
		}, 70)

		return () => clearInterval(typingInterval)
	}, [isTyping, typingMessage])

	return (
		<div className="flex flex-col gap-2 items-center justify-center bg-zinc-950 min-h-screen">
			<Card className="w-[440px] bg-zinc-900 border-none">
				<CardHeader className='border-b border-zinc-600/20'>
					<CardTitle className="text-white">Chat Inte</CardTitle>
					<CardDescription>Converse com a inteligência artificial sobre a vida.</CardDescription>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-[600px] w-full space-y-4">
						{messages.map(m => (
							<div key={m.id} className="whitespace-pre-wrap">
								{m.role === 'user' ? (
									<div className="flex gap-3 space-y-2 text-slate-300 text-sm">
										<Avatar>
											<AvatarImage src='/avatar.jpeg' />
											<AvatarFallback><Skeleton className='w-full h-full bg-zinc-500' /></AvatarFallback>
										</Avatar>
										<p className="leading-relaxed">
											<span className="block font-bold text-slate-100">Nathan:</span>
											{m.content}
										</p>
									</div>
								) : (
									<div className="flex gap-3 text-slate-300 text-sm">
										<Avatar>
											<AvatarImage src="https://github.com/rocketseat.png" />
											<AvatarFallback>Houston:</AvatarFallback>
										</Avatar>
										<p className="leading-relaxed">
											<span className="block font-bold text-slate-100">AI:</span>
											{m.content}
										</p>
									</div>
								)}
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
			<p className='text-xs text-zinc-800'>Powered by Nathan Palatin &copy; 2024</p>
		</div>
	)
}
