
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Shield, MessageSquare, Gift, Trash2, Music, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import type { LevelMessage } from '@/ai/flows/personalized-level-messages';
import { Textarea } from '@/components/ui/textarea';
import { addLevelMessage, deleteLevelMessage, getContactMessages, getLevelMessages, getWishes, uploadFile, type Wish, type ContactMessage } from '@/lib/firebase/firestore';

function AdminDashboard() {
  const { toast } = useToast();
  const [levelMessages, setLevelMessages] = useState<LevelMessage[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);


  const fetchAdminData = useCallback(async () => {
    setIsLoading(true);
    try {
        const [levels, wishData, contacts] = await Promise.all([
            getLevelMessages(),
            getWishes(),
            getContactMessages()
        ]);
        setLevelMessages(levels);
        setWishes(wishData);
        setContactMessages(contacts);
    } catch (error) {
        console.error("Error fetching admin data:", error);
        toast({
            variant: 'destructive',
            title: "Error",
            description: "Could not load data from the database.",
        });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);


  const handleDeleteWish = async (id: string) => {
    try {
        await deleteLevelMessage('wishes', id);
        setWishes(prev => prev.filter(w => w.id !== id));
        toast({
            title: "Wish Deleted",
            description: `The wish has been permanently deleted.`,
        });
    } catch (error) {
        console.error("Error deleting wish:", error);
        toast({
            variant: 'destructive',
            title: "Error",
            description: "Could not delete the wish.",
        });
    }
  };

  const handleAddLevelMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    const form = e.currentTarget;
    const messageInput = form.elements.namedItem('level-message') as HTMLInputElement;
    const imageUrlInput = form.elements.namedItem('level-image-url') as HTMLInputElement;
    const audioUrlInput = form.elements.namedItem('level-audio-url') as HTMLInputElement;
    
    const message = messageInput.value;
    
    if (!message.trim()) {
        toast({ variant: 'destructive', title: "Message is required." });
        setIsUploading(false);
        return;
    }

    try {
        let imageUrl = imageUrlInput.value || '';
        let audioUrl = audioUrlInput.value || '';

        if (imageFile) {
            imageUrl = await uploadFile(imageFile, 'level-images');
        }
        if (audioFile) {
            audioUrl = await uploadFile(audioFile, 'level-audio');
        }
        
        await addLevelMessage({ message, imageUrl, audioUrl });
        
        toast({
            title: "Level Message Added",
            description: `The new message has been saved to the database.`,
        });
        
        // Reset form
        messageInput.value = '';
        imageUrlInput.value = '';
        audioUrlInput.value = '';
        setImageFile(null);
        setAudioFile(null);
        
        // Refresh data
        await fetchAdminData();

    } catch (error) {
        console.error("Error adding level message:", error);
        toast({ variant: 'destructive', title: "Upload Failed", description: "Could not save the new message." });
    } finally {
        setIsUploading(false);
    }
  };

  const handleDeleteLevelMessage = async (id: string) => {
      try {
          await deleteLevelMessage('level-messages', id);
          setLevelMessages(prev => prev.filter(msg => msg.id !== id));
          toast({ title: "Message Deleted", description: "The message has been removed." });
      } catch (error) {
          console.error("Error deleting level message:", error);
          toast({ variant: 'destructive', title: "Error", description: "Could not delete the message." });
      }
  };

  const renderStatusIcon = (url?: string) => {
    return url ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-yellow-500" />;
  }

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
                      <TabsTrigger value="audio">Audio (Legacy)</TabsTrigger>
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
                                  <Label htmlFor="level-message">Message (Required)</Label>
                                  <Textarea id="level-message" name="level-message" placeholder="Add a new level complete message..." required/>
                                </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="level-image-upload">Upload Image (or paste URL)</Label>
                                         <div className="flex gap-2">
                                            <Input id="level-image-url" name="level-image-url" type="text" placeholder="Paste image URL here..." />
                                            <Button asChild variant="outline" size="icon" className="relative">
                                              <label htmlFor="level-image-upload-file">
                                                <Upload className="h-4 w-4" />
                                                <input id="level-image-upload-file" type="file" className="sr-only" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                                              </label>
                                            </Button>
                                         </div>
                                         {imageFile && <p className="text-xs text-muted-foreground">Selected: {imageFile.name}</p>}
                                     </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="level-audio-upload">Upload Audio (or paste URL)</Label>
                                         <div className="flex gap-2">
                                            <Input id="level-audio-url" name="level-audio-url" type="text" placeholder="Paste audio URL here..." />
                                            <Button asChild variant="outline" size="icon" className="relative">
                                               <label htmlFor="level-audio-upload-file">
                                                <Upload className="h-4 w-4" />
                                                 <input id="level-audio-upload-file" type="file" className="sr-only" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)}/>
                                               </label>
                                            </Button>
                                          </div>
                                          {audioFile && <p className="text-xs text-muted-foreground">Selected: {audioFile.name}</p>}
                                     </div>
                                 </div>
                                  <Button type="submit" disabled={isUploading}>
                                      {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                      {isUploading ? 'Saving...' : 'Add Message'}
                                  </Button>
                             </form>
                             <div className="space-y-4">
                                  <h3 className="font-medium text-lg">Existing Messages</h3>
                                  {isLoading ? <Loader2 className="mx-auto my-4 h-6 w-6 animate-spin"/> : levelMessages.map((msg) => (
                                      <div key={msg.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                                          <div className="flex-1">
                                            <p className="text-sm font-semibold">{msg.message}</p>
                                            <div className="flex gap-4 mt-1 text-xs text-muted-foreground items-center">
                                                <span className="flex items-center gap-1">Image: {renderStatusIcon(msg.imageUrl)}</span>
                                                <span className="flex items-center gap-1">Audio: {renderStatusIcon(msg.audioUrl)}</span>
                                            </div>
                                          </div>
                                          <Button variant="ghost" size="icon" onClick={() => handleDeleteLevelMessage(msg.id!)}>
                                              <Trash2 className="h-4 w-4 text-destructive" />
                                          </Button>
                                      </div>
                                  ))}
                             </div>
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
                              {isLoading ? <Loader2 className="mx-auto my-4 h-6 w-6 animate-spin"/> : contactMessages.map((msg) => (
                                  <div key={msg.id} className="p-3 rounded-lg border bg-card">
                                      <p className="font-semibold text-sm">{msg.name}</p>
                                      <p className="text-sm text-muted-foreground">{msg.message}</p>
                                      {msg.createdAt && <p className="text-xs text-muted-foreground mt-1">{new Date(msg.createdAt.seconds * 1000).toLocaleString()}</p>}
                                  </div>
                              ))}
                              {contactMessages.length === 0 && !isLoading && <p className="text-sm text-muted-foreground text-center">No contact messages yet.</p>}
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
                              {isLoading ? <Loader2 className="mx-auto my-4 h-6 w-6 animate-spin"/> : wishes.map((wish) => (
                                  <div key={wish.id} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                                      <div className="flex-1">
                                        <p className="text-sm font-bold">{wish.author}</p>
                                        <p className="text-sm text-muted-foreground">{wish.message}</p>
                                      </div>
                                      <Button variant="ghost" size="icon" onClick={() => handleDeleteWish(wish.id!)}>
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                  </div>
                              ))}
                              {wishes.length === 0 && !isLoading && <p className="text-sm text-muted-foreground text-center">No wishes yet.</p>}
                          </CardContent>
                      </Card>
                  </TabsContent>

                   <TabsContent value="audio" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Music /> Audio URL Management</CardTitle>
                                <CardDescription>
                                    This section is for legacy purposes. Audio can now be uploaded directly with Level Messages.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Please use the "Level Messages" tab to manage audio for level completions.</p>
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
