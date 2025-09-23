
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Shield, MessageSquare, Gift, Trash2, Music, Image as ImageIcon, FileAudio } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { AudioPlayer } from '@/components/audio-player';
import type { LevelMessage } from '@/ai/flows/personalized-level-messages';
import { Textarea } from '@/components/ui/textarea';

// Mock data - in a real app, this would come from a database
const mockLevelMessages: LevelMessage[] = [
  { message: "Wow, you're a natural at this!", imageUrl: 'https://picsum.photos/seed/1/200/200', audioUrl: '/music/level-complete-sfx.mp3' },
  { message: "Incredible! On to the next one.", imageUrl: 'https://picsum.photos/seed/2/200/200', audioUrl: '/music/level-complete-sfx.mp3' },
  { message: "You've got a great memory!", imageUrl: 'https://picsum.photos/seed/3/200/200', audioUrl: '/music/level-complete-sfx.mp3' },
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
    toast({
        title: "Wish Deleted (Simulated)",
        description: `Wish at index ${index} would be deleted in a real database.`,
    });
  };

  const handleAddLevelMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const messageInput = form.elements.namedItem('level-message') as HTMLInputElement;
    const message = messageInput.value;
    
    if (message.trim()) {
        toast({
            title: "Level Message Added (Simulated)",
            description: `Message "${message}" would be added to the database.`,
        });
        messageInput.value = '';
        // In a real app, you'd also handle the file uploads here
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>, audioType: string) => {
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        toast({
            title: "Audio Uploaded (Simulated)",
            description: `${audioType} updated with file: ${file.name}.`,
        });
    }
  };


  return (
    <>
      <AudioPlayer src="/music/arcade-birthday.mp3" />
      <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                  <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl mt-4">Admin Dashboard</CardTitle>
              <CardDescription>
                  Manage level messages, audio, and moderate content.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <Tabs defaultValue="level-messages" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="level-messages">Level Messages</TabsTrigger>
                      <TabsTrigger value="contact">Contact Messages</TabsTrigger>
                      <TabsTrigger value="wishes">Moderate Wishes</TabsTrigger>
                      <TabsTrigger value="audio">Audio</TabsTrigger>
                  </TabsList>

                  <TabsContent value="level-messages" className="mt-6">
                      <Card>
                          <CardHeader>
                              <CardTitle>Game Level Completion Messages</CardTitle>
                              <CardDescription>
                                 Manage the messages, images, and sounds that appear when a player completes a level.
                              </CardDescription>
                          </CardHeader>
                          <CardContent>
                             <form onSubmit={handleAddLevelMessage} className="space-y-4 p-4 border rounded-lg mb-6">
                                <h3 className="font-medium text-lg">Add New Level Message</h3>
                                <div className="space-y-2">
                                  <Label htmlFor="level-message">Message</Label>
                                  <Textarea id="level-message" name="level-message" placeholder="Add a new level complete message..." />
                                </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="level-image">Image</Label>
                                         <div className="relative">
                                            <Input id="level-image" name="level-image" type="file" accept="image/*" className="pl-10" />
                                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                         </div>
                                     </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="level-audio">Audio</Label>
                                          <div className="relative">
                                            <Input id="level-audio" name="level-audio" type="file" accept="audio/*" className="pl-10" />
                                            <FileAudio className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                          </div>
                                     </div>
                                 </div>
                                  <Button type="submit">Add Message</Button>
                             </form>
                             <div className="space-y-4">
                                  <h3 className="font-medium text-lg">Existing Messages</h3>
                                  {mockLevelMessages.map((msg, i) => (
                                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                                          <div className="flex-1">
                                            <p className="text-sm font-semibold">{msg.message}</p>
                                            <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                                                <span>Image: {msg.imageUrl ? 'Yes' : 'No'}</span>
                                                <span>Audio: {msg.audioUrl ? 'Yes' : 'No'}</span>
                                            </div>
                                          </div>
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

                   <TabsContent value="audio" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Music /> Audio Management</CardTitle>
                                <CardDescription>
                                    Upload and manage background music and sound effects for the application.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4">
                                    <h3 className="text-lg font-medium">Background Music</h3>
                                    <div className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="main-music">Main Page Music</Label>
                                            <Input id="main-music" type="file" accept="audio/*" onChange={(e) => handleAudioUpload(e, 'Main Page Music')} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="game-music">Game Page Music</Label>
                                            <Input id="game-music" type="file" accept="audio/*" onChange={(e) => handleAudioUpload(e, 'Game Page Music')} />
                                        </div>
                                         <div className="grid gap-2">
                                            <Label htmlFor="wishes-music">Wishes Page Music</Label>
                                            <Input id="wishes-music" type="file" accept="audio/*" onChange={(e) => handleAudioUpload(e, 'Wishes Page Music')} />
                                        </div>
                                         <div className="grid gap-2">
                                            <Label htmlFor="contact-music">Contact Page Music</Label>
                                            <Input id="contact-music" type="file" accept="audio/*" onChange={(e) => handleAudioUpload(e, 'Contact Page Music')} />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-4">
                                     <h3 className="text-lg font-medium">Sound Effects (SFX)</h3>
                                      <div className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="card-flip-sfx">Card Flip SFX</Label>
                                            <Input id="card-flip-sfx" type="file" accept="audio/*" onChange={(e) => handleAudioUpload(e, 'Card Flip SFX')} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="level-complete-sfx">Level Complete SFX</Label>
                                            <Input id="level-complete-sfx" type="file" accept="audio/*" onChange={(e) => handleAudioUpload(e, 'Level Complete SFX')} />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-4">Full database integration is required to save and serve uploaded audio files.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
              </Tabs>
          </CardContent>
      </Card>
    </>
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
