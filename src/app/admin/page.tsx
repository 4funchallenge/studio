
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Shield, MessageSquare, Gift, Trash2, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Mock data - in a real app, this would come from a database
const mockLevelMessages = [
  "Wow, you're a natural at this!",
  "Incredible! On to the next one.",
  "You've got a great memory!",
];

const mockContactMessages = [
    { name: 'Test User 1', message: 'This is a great app!', image: 'Not uploaded' },
    { name: 'Test User 2', message: 'Found a bug on the game page.', image: 'Not uploaded' },
];

const mockWishes = [
    { author: 'Visitor #1', message: 'Happy Birthday Afnan! Have a wonderful day!' },
    { author: 'Visitor #2', message: 'Wishing you all the best on your special day!' },
];


function AdminDashboard() {
  const { toast } = useToast();

  const handleDeleteWish = (index: number) => {
    // This is a placeholder for actual deletion logic
    toast({
        title: "Wish Deleted (Simulated)",
        description: `Wish at index ${index} would be deleted in a real database.`,
    });
  };

  const handleAddLevelMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('level-message') as HTMLInputElement;
    const message = input.value;
    
    if (message.trim()) {
        toast({
            title: "Level Message Added (Simulated)",
            description: `Message "${message}" would be added to the database.`,
        });
        input.value = '';
    }
  };


  return (
    <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl mt-4">Admin Dashboard</CardTitle>
            <CardDescription>
                Manage level messages, view contact submissions, and moderate wishes.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="level-messages" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="level-messages">Level Messages</TabsTrigger>
                    <TabsTrigger value="contact">Contact Messages</TabsTrigger>
                    <TabsTrigger value="wishes">Moderate Wishes</TabsTrigger>
                </TabsList>

                <TabsContent value="level-messages" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Game Level Messages</CardTitle>
                            <CardDescription>
                                These messages can be used for level completion instead of AI-generated ones.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <form onSubmit={handleAddLevelMessage} className="flex gap-2 mb-4">
                                <Input name="level-message" placeholder="Add a new level complete message..." />
                                <Button type="submit">Add</Button>
                           </form>
                           <div className="space-y-2">
                                {mockLevelMessages.map((msg, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                                        <p className="text-sm">{msg}</p>
                                        <Button variant="ghost" size="icon" disabled>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                           </div>
                           <p className="text-xs text-muted-foreground mt-4">Full database integration is required to manage messages.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="contact" className="mt-6">
                    <Card>
                         <CardHeader>
                            <CardTitle>Contact Form Submissions</CardTitle>
                            <CardDescription>
                                Messages sent via the "Get in Touch" page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mockContactMessages.map((msg, i) => (
                                <div key={i} className="p-3 rounded-lg border bg-card">
                                    <p className="font-semibold text-sm">{msg.name}</p>
                                    <p className="text-sm text-muted-foreground">{msg.message}</p>
                                </div>
                            ))}
                            <p className="text-xs text-muted-foreground mt-4">Full database integration is required to view and manage submissions.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="wishes" className="mt-6">
                     <Card>
                         <CardHeader>
                            <CardTitle>Moderate Birthday Wishes</CardTitle>
                            <CardDescription>
                                Review and remove any inappropriate wishes from the public wishes board.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {mockWishes.map((wish, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                                    <div className="flex-1">
                                      <p className="text-sm font-bold">{wish.author}</p>
                                      <p className="text-sm text-muted-foreground">{wish.message}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteWish(i)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                             <p className="text-xs text-muted-foreground mt-4">Full database integration is required to moderate wishes.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '5152') {
      setIsAuthenticated(true);
      toast({
        title: 'Access Granted',
        description: 'Welcome to the Admin Dashboard.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'The password you entered is incorrect.',
      });
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl mt-4">Admin Access</CardTitle>
            <CardDescription>Please enter the password to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <AdminDashboard />
    </div>
  );
}

    