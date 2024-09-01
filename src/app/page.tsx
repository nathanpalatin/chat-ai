'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { Send } from 'lucide-react'
import { useChat } from 'ai/react'

export default function Home() {
	const { messages, input, handleInputChange, handleSubmit } = useChat({
		api: '/api/chat',
	})


	return (
		<div className="flex flex-col gap-2 items-center justify-center bg-zinc-950 min-h-screen">
			<Card className="w-[440px] bg-zinc-900 border-none">
				<CardHeader className='border-b border-zinc-600/20'>
					<CardTitle className="text-white">Chat AI</CardTitle>
					<CardDescription>Converse com a inteligencia artificial sobre a vida.</CardDescription>
				</CardHeader>
				<CardContent>

					<ScrollArea className="h-[600px] w-full space-y-4 ">
						{messages.map(m => (
							<div key={m.id} className="whitespace-pre-wrap">
								{m.role === 'user' ? (
									<div className="flex gap-3 space-y-2 text-slate-300 text-sm">
										<Avatar>
											<AvatarImage src="https://media.licdn.com/dms/image/v2/D4D03AQHUCi1hJnMNAA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1721480988337?e=1730937600&v=beta&t=zJ8TTAdmpFER2jvFVjGWspqbwDcMKoRtC9o3o6FC-Gg" />
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
											<AvatarFallback>AI</AvatarFallback>
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
