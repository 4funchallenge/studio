
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Shield, MessageSquare, Gift, Trash2, Music, Image as ImageIcon, FileAudio, Link as LinkIcon, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import type { LevelMessage } from '@/ai/flows/personalized-level-messages';
import { Textarea } from '@/components/ui/textarea';

// Mock data - in a real app, this would come from a database
const mockLevelMessages: LevelMessage[] = [
  { message: "Wow, you're a natural at this!", imageUrl: 'https://picsum.photos/seed/1/200/200', audioUrl: 'https://storage.googleapis.com/studiopanda-assets/level-complete.mp3' },
  { message: "Incredible! On to the next one.", imageUrl: 'https://picsum.photos/seed/2/200/200', audioUrl: 'https://storage.googleapis.com/studiopanda-assets/level-complete.mp3' },
  { message: "You've got a great memory!", imageUrl: 'https://picsum.photos/seed/3/200/200', audioUrl: 'https://storage.googleapis.com/studiopanda-assets/level-complete.mp3' },
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
        // In a real app, you'd also handle the file uploads/URL saves here
    }
  };

  const handleAudioUrlUpdate = (e: React.FormEvent<HTMLFormElement>, audioType: string) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem(audioType) as HTMLInputElement;
    const url = input.value;
    if (url.trim()) {
        toast({
            title: "Audio URL Updated (Simulated)",
            description: `${audioType} updated with URL: ${url}.`,
        });
    }
  };


  return (
    <>
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
                                        <Label htmlFor="level-image-url">Image URL</Label>
                                         <div className="flex gap-2">
                                            <Input id="level-image-url" name="level-image-url" type="text" placeholder="Paste image URL here..." />
                                            <Button variant="outline" size="icon" disabled><Upload className="h-4 w-4" /></Button>
                                         </div>
                                         <p className="text-xs text-muted-foreground">For now, please host images and paste the URL. Direct uploads require Firebase Storage integration.</p>
                                     </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="level-audio-url">Audio URL</Label>
                                         <div className="flex gap-2">
                                            <Input id="level-audio-url" name="level-audio-url" type="text" placeholder="Paste audio URL here..." />
                                            <Button variant="outline" size="icon" disabled><Upload className="h-4 w-4" /></Button>
                                          </div>
                                          <p className="text-xs text-muted-foreground">For now, please host audio and paste the URL. Direct uploads require Firebase Storage integration.</p>
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
                                <CardTitle className="flex items-center gap-2"><Music /> Audio URL Management</CardTitle>
                                <CardDescription>
                                    Update the URLs for background music and sound effects.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4">
                                    <h3 className="text-lg font-medium">Background Music</h3>
                                    <div className="space-y-4">
                                        <form onSubmit={(e) => handleAudioUrlUpdate(e, 'main-music-url')} className="grid gap-2">
                                            <Label htmlFor="main-music-url">Main Page Music URL</Label>
                                            <div className="flex gap-2">
                                                <Input id="main-music-url" name="main-music-url" type="url" placeholder="https://example.com/music.mp3" />
                                                <Button type="submit">Save</Button>
                                            </div>
                                        </form>
                                        <form onSubmit={(e) => handleAudioUrlUpdate(e, 'game-music-url')} className="grid gap-2">
                                            <Label htmlFor="game-music-url">Game Page Music URL</Label>
                                            <div className="flex gap-2">
                                                <Input id="game-music-url" name="game-music-url" type="url" placeholder="https://example.com/music.mp3" />
                                                <Button type="submit">Save</Button>
                                            </div>
                                        </form>
                                         <form onSubmit={(e) => handleAudioUrlUpdate(e, 'wishes-music-url')} className="grid gap-2">
                                            <Label htmlFor="wishes-music-url">Wishes Page Music URL</Label>
                                            <div className="flex gap-2">
                                                <Input id="wishes-music-url" name="wishes-music-url" type="url" placeholder="https://example.com/music.mp3" />
                                                <Button type="submit">Save</Button>
                                            </div>
                                        </form>
                                         <form onSubmit={(e) => handleAudioUrlUpdate(e, 'contact-music-url')} className="grid gap-2">
                                            <Label htmlFor="contact-music-url">Contact Page Music URL</Label>
                                            <div className="flex gap-2">
                                                <Input id="contact-music-url" name="contact-music-url" type="url" placeholder="https://example.com/music.mp3" />
                                                <Button type="submit">Save</Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="grid gap-4">
                                     <h3 className="text-lg font-medium">Sound Effects (SFX)</h3>
                                      <div className="space-y-4">
                                        <form onSubmit={(e) => handleAudioUrlUpdate(e, 'card-flip-sfx-url')} className="grid gap-2">
                                            <Label htmlFor="card-flip-sfx-url">Card Flip SFX URL</Label>
                                            <div className="flex gap-2">
                                                <Input id="card-flip-sfx-url" name="card-flip-sfx-url" type="url" placeholder="https://example.com/sfx.mp3" />
                                                <Button type="submit">Save</Button>
                                            </div>
                                        </form>
                                        <form onSubmit={(e) => handleAudioUrlUpdate(e, 'level-complete-sfx-url')} className="grid gap-2">
                                            <Label htmlFor="level-complete-sfx-url">Level Complete SFX URL</Label>
                                            <div className="flex gap-2">
                                                <Input id="level-complete-sfx-url" name="level-complete-sfx-url" type="url" placeholder="https://example.com/sfx.mp3" />
                                                <Button type="submit">Save</Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-4">Full database integration is required to save and serve updated audio URLs.</p>
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

    