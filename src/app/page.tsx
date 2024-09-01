'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { useChat } from 'ai/react'
import { Send } from 'lucide-react'

export default function Home() {
	const { messages, input, handleInputChange, handleSubmit } = useChat({
		api: '/api/chat'
	})

	return (
		<div className="flex flex-col gap-2 items-center justify-center bg-zinc-950 min-h-screen">
			<Card className="w-[440px] bg-zinc-900 border-none">
				<CardHeader>
					<CardTitle className="text-white">Chat AI</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<ScrollArea className=" h-[600px] w-full space-y-4 ">
						{messages.map(m => (
							<div key={m.id} className="whitespace-pre-wrap">
								{m.role === 'user' ? (
									<div className="flex gap-3 space-y-2 text-slate-300 text-sm">
										<Avatar>
											<AvatarImage src="https://github.com/nathanpalatin.png" />
											<AvatarFallback>NP</AvatarFallback>
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
							className="w-full text-zinc-100 bg-zinc-700 border-none"
							onChange={handleInputChange}
							value={input}
							placeholder="How can I help you?"
						/>
						<Button disabled={input.length === 0} className="bg-zinc-800" type="submit">
							<Send className={'text-zinc-400 size-5'} />
						</Button>
					</form>

				</CardFooter>

			</Card>
			<p className='text-xs text-zinc-700'>Powered by Nathan Palatin</p>
		</div>
	)
}
