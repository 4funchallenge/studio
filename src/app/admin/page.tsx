import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl mt-4">Admin Dashboard</CardTitle>
          <CardDescription>
            This is the central control panel for Afnan's Birthday Blast.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center text-muted-foreground">
            <p>From here, you will be able to manage all aspects of the application.</p>
            <ul className="list-disc list-inside bg-card p-4 rounded-lg border text-left">
              <li>
                <strong>Countdown Timer:</strong> Set and adjust the target date and time for the birthday countdown.
              </li>
              <li>
                <strong>Content Management:</strong> View and moderate comments and contact form submissions.
              </li>
              <li>
                <strong>Game Settings:</strong> Configure levels and messages for the memory game.
              </li>
            </ul>
            <p className="pt-4 text-sm">This area is currently a placeholder. Full functionality requires backend and database integration.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
