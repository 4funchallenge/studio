
'use server';

/**
 * @fileOverview An AI agent that generates personalized level completion messages.
 *
 * - generatePersonalizedMessage - A function that generates a personalized level completion message.
 * - PersonalizedMessageInput - The input type for the generatePersonalizedMessage function.
 * - PersonalizedMessageOutput - The return type for the generatePersonalizedMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedMessageInputSchema = z.object({
  levelCompleted: z.number().describe('The level number that was completed.'),
  userMessages: z.array(z.string()).describe('Array of user messages from a database.'),
  levelMessages: z.array(z.string()).describe('Array of level completion messages from a database.'),
});
export type PersonalizedMessageInput = z.infer<typeof PersonalizedMessageInputSchema>;

const PersonalizedMessageOutputSchema = z.object({
  message: z.string().describe('The personalized level completion message.'),
  imageDataUri: z.string().describe(
    "A photo to accompany the message, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  audioDataUri: z.string().describe(
    "An audio clip to accompany the message, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type PersonalizedMessageOutput = z.infer<typeof PersonalizedMessageOutputSchema>;

export async function generatePersonalizedMessage(
  input: PersonalizedMessageInput
): Promise<PersonalizedMessageOutput> {
  return personalizedLevelMessagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedLevelMessagesPrompt',
  input: {schema: PersonalizedMessageInputSchema},
  output: {schema: z.object({ message: z.string() })},
  prompt: `You are an AI assistant that generates personalized level completion messages for a birthday-themed arcade game.

  The player has just completed level {{{levelCompleted}}}.

  Here are some user messages from a database which might contain birthday wishes or other comments:
  {{{userMessages}}}

  Here is a list of approved, generic level completion messages from a database:
  {{{levelMessages}}}

  Your task is to choose ONE message from the 'levelMessages' list that fits the occasion.
  Then, you can optionally personalize it slightly by creatively incorporating a theme or a name from the 'userMessages' list.
  Keep the message short, encouraging, and celebratory.
  
  Return only the final, single message.
`,
});

import wav from 'wav';

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const personalizedLevelMessagesFlow = ai.defineFlow(
  {
    name: 'personalizedLevelMessagesFlow',
    inputSchema: PersonalizedMessageInputSchema,
    outputSchema: PersonalizedMessageOutputSchema,
  },
  async input => {
    // Determine whether to use AI or a pre-defined message.
    // For this example, we'll randomly decide. In a real app, this could be a setting in the admin dashboard.
    const useAiForMessage = Math.random() > 0.5;
    let message: string;

    if (useAiForMessage) {
        const promptResult = await prompt(input);
        message = promptResult.output!.message;
    } else {
        // Pick a random message from the provided level messages
        message = input.levelMessages[Math.floor(Math.random() * input.levelMessages.length)];
    }


    // Generate the image
    const imageDescription = `Generate a fun, vibrant, arcade-style image celebrating the completion of a game level. The theme is a birthday party. The image should be celebratory and family-friendly.`;
    const imageResult = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: imageDescription,
    });

    // Generate the audio
    const audioPrompt = `Speaker1: Woo-hoo! Speaker2: Great job! Let's go to the next level!`;
    const audioResult = await ai.generate({
      model: ai.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: 'Speaker1',
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Algenib' },
                },
              },
              {
                speaker: 'Speaker2',
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Achernar' },
                },
              },
            ],
          },
        },
      },
      prompt: audioPrompt,
    });

    let audioDataUri = "";
    if (audioResult.media) {
        const audioBuffer = Buffer.from(
            audioResult.media.url.substring(audioResult.media.url.indexOf(',') + 1),
            'base64'
          );
        audioDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));
    }

    return {
      message: message,
      imageDataUri: imageResult.media!.url,
      audioDataUri: audioDataUri,
    };
  }
);

    