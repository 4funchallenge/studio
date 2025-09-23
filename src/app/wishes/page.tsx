
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Send, Gift, Loader2 } from 'lucide-react';
import { addWish, getWishes, likeWish, type Wish, addChatMessage, onChatMessagesSnapshot, type ChatMessage } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWishAuthor, setNewWishAuthor] = useState('');
  const [newWishMessage, setNewWishMessage] = useState('');
  const [isSubmittingWish, setIsSubmittingWish] = useState(false);
  const [isLoadingWishes, setIsLoadingWishes] = useState(true);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [isSubmittingChatMessage, setIsSubmittingChatMessage] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchWishes = async () => {
      setIsLoadingWishes(true);
      try {
        const fetchedWishes = await getWishes();
        setWishes(fetchedWishes);
      } catch (error) {
        console.error("Error fetching wishes:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load wishes.' });
      } finally {
        setIsLoadingWishes(false);
      }
    };
    fetchWishes();
  }, [toast]);
  
  useEffect(() => {
    // Set up the real-time listener for chat messages
    const unsubscribe = onChatMessagesSnapshot((messages) => {
        setChatMessages(messages);
        // Scroll to bottom when new messages arrive
        setTimeout(() => {
             chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
        }, 100);
    }, (error) => {
        console.error("Error listening to chat messages:", error);
        toast({ variant: 'destructive', title: 'Chat Error', description: 'Could not connect to live chat.' });
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [toast]);


  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newWishMessage.trim() && newWishAuthor.trim()) {
      setIsSubmittingWish(true);
      try {
        const newWish = { author: newWishAuthor, message: newWishMessage };
        const newWishId = await addWish(newWish);
        setWishes(prev => [{ ...newWish, id: newWishId, likes: 0 }, ...prev]);
        setNewWishAuthor('');
        setNewWishMessage('');
        toast({ title: "Wish Posted!", description: "Thank you for sharing your birthday wish." });
      } catch (error) {
        console.error("Error adding wish:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not post your wish.' });
      } finally {
        setIsSubmittingWish(false);
      }
    }
  };

  const handleLike = async (id: string) => {
    // Optimistic UI update
    const originalWishes = [...wishes];
    setWishes(prevWishes => 
      prevWishes.map(wish => 
        wish.id === id ? { ...wish, likes: (wish.likes || 0) + 1 } : wish
      )
    );

    try {
      await likeWish(id);
    } catch (error) {
      // Revert if the database update fails
      setWishes(originalWishes);
      console.error("Error liking wish:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save your like.' });
    }
  };
  
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newChatMessage.trim()) {
      setIsSubmittingChatMessage(true);
      const randomVisitor = `Visitor #${Math.floor(Math.random() * 999) + 1}`;
      try {
        await addChatMessage({ author: randomVisitor, message: newChatMessage });
        setNewChatMessage('');
      } catch (error) {
        console.error("Error sending chat message:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not send your message.' });
      } finally {
        setIsSubmittingChatMessage(false);
      }
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
                <form onSubmit={handleWishSubmit} className="space-y-4">
                  <Input
                    placeholder="Your Name"
                    value={newWishAuthor}
                    onChange={(e) => setNewWishAuthor(e.target.value)}
                    required
                  />
                  <Textarea
                    placeholder="Write your birthday wish here..."
                    value={newWishMessage}
                    onChange={(e) => setNewWishMessage(e.target.value)}
                    className="min-h-[100px]"
                    required
                  />
                  <Button type="submit" className="w-full" disabled={isSubmittingWish}>
                    {isSubmittingWish && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Post Wish
                  </Button>
                </form>
                <div className="space-y-4">
                  {isLoadingWishes ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : wishes.map((wish) => (
                    <Card key={wish.id} className="bg-background/50">
                      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
                        <Avatar>
                          <AvatarFallback>{wish.author.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{wish.author}</p>
                          <p className="text-sm text-foreground/80 font-handwritten">{wish.message}</p>
                        </div>
                      </CardHeader>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="ghost" size="sm" onClick={() => handleLike(wish.id!)} className="flex items-center gap-2">
                          <Heart className={`h-4 w-4 ${(wish.likes || 0) > 0 ? 'text-primary fill-current' : ''}`} />
                          <span>{wish.likes || 0}</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="chat" className="mt-6">
                <div className="flex flex-col h-[450px] space-y-4">
                    <div ref={chatContainerRef} className="flex-1 space-y-4 overflow-y-auto rounded-lg border p-4">
                        {chatMessages.length === 0 && (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                Be the first to say something!
                            </div>
                        )}
                        {chatMessages.map((msg, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{msg.author.charAt(0).toUpperCase()}</AvatarFallback>
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
                            disabled={isSubmittingChatMessage}
                        />
                        <Button type="submit" size="icon" disabled={isSubmittingChatMessage}>
                            {isSubmittingChatMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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
