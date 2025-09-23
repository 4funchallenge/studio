
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Send, Gift, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Wish = {
  author: string;
  message: string;
  likes: number;
};

type ChatMessage = {
  author: string;
  message: string;
};

const initialWishes: Wish[] = [
  { author: 'Visitor #1', message: 'Happy Birthday Afnan! Have a wonderful day!', likes: 12 },
  { author: 'Visitor #2', message: 'Wishing you all the best on your special day!', likes: 8 },
];

const initialChatMessages: ChatMessage[] = [
    { author: 'Visitor #1', message: 'Hey everyone!' },
    { author: 'Visitor #3', message: 'Happy birthday from Canada!' },
];

export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [newWish, setNewWish] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [newChatMessage, setNewChatMessage] = useState('');

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWish.trim()) {
      const newAuthor = `Visitor #${wishes.length + 1}`;
      setWishes([...wishes, { author: newAuthor, message: newWish, likes: 0 }]);
      setNewWish('');
    }
  };

  const handleLike = (index: number) => {
    const updatedWishes = [...wishes];
    updatedWishes[index].likes += 1;
    setWishes(updatedWishes);
  };
  
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChatMessage.trim()) {
      // For simplicity, we'll use a random visitor number for chat
      const randomVisitor = `Visitor #${Math.floor(Math.random() * 20) + 1}`;
      setChatMessages([...chatMessages, { author: randomVisitor, message: newChatMessage }]);
      setNewChatMessage('');
    }
  };


  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                <Gift className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="font-headline text-3xl mt-2">Birthday Wishes!</CardTitle>
          <CardDescription>Share your birthday wishes for Afnan and chat with other guests!</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="wishes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="wishes">Wishes</TabsTrigger>
              <TabsTrigger value="chat">Live Chat</TabsTrigger>
            </TabsList>
            <TabsContent value="wishes" className="mt-6">
              <div className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Note</AlertTitle>
                  <AlertDescription>
                    This is a demo. Your wishes are not saved permanently and will disappear on refresh. Full database integration is coming soon!
                  </AlertDescription>
                </Alert>
                <form onSubmit={handleWishSubmit} className="space-y-4">
                  <Textarea
                    placeholder="Write your birthday wish here..."
                    value={newWish}
                    onChange={(e) => setNewWish(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button type="submit" className="w-full">Post Wish</Button>
                </form>
                <div className="space-y-4">
                  {wishes.map((wish, index) => (
                    <Card key={index} className="bg-background/50">
                      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
                        <Avatar>
                          <AvatarFallback>{wish.author.substring(9, 11)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{wish.author}</p>
                          <p className="text-sm text-foreground/80 font-handwritten">{wish.message}</p>
                        </div>
                      </CardHeader>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="ghost" size="sm" onClick={() => handleLike(index)} className="flex items-center gap-2">
                          <Heart className={`h-4 w-4 ${wish.likes > 0 ? 'text-primary fill-current' : ''}`} />
                          <span>{wish.likes}</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  )).reverse()}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="chat" className="mt-6">
                <div className="flex flex-col h-[400px] space-y-4">
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Note</AlertTitle>
                        <AlertDescription>
                            The chat is for demonstration only. Messages are not saved.
                        </AlertDescription>
                    </Alert>
                    <div className="flex-1 space-y-4 overflow-y-auto rounded-lg border p-4">
                        {chatMessages.map((msg, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{msg.author.substring(9,11)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold">{msg.author}</p>
                                    <div className="rounded-lg bg-muted p-2 text-sm">{msg.message}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
                        <Input 
                            placeholder="Type a message..." 
                            value={newChatMessage}
                            onChange={(e) => setNewChatMessage(e.target.value)}
                        />
                        <Button type="submit" size="icon">
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
