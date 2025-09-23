
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
import wav from 'wav';

// Define the shape of a single level message object
export const LevelMessageSchema = z.object({
  message: z.string(),
  imageUrl: z.string().optional(),
  audioUrl: z.string().optional(),
});
export type LevelMessage = z.infer<typeof LevelMessageSchema>;


const PersonalizedMessageInputSchema = z.object({
  levelCompleted: z.number().describe('The level number that was completed.'),
  // The user messages are kept for potential future use, but are not used in this flow.
  userMessages: z.array(z.string()).describe('Array of user messages from a database.'),
  // This is now an array of LevelMessage objects
  levelMessages: z.array(LevelMessageSchema).describe('Array of level completion message objects from a database.'),
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
    // Pick a random message from the provided level messages
    const selectedMessage = input.levelMessages[Math.floor(Math.random() * input.levelMessages.length)];
    
    // For now, we are not using AI to generate image/audio, but this can be re-enabled.
    // The image and audio will come from the selectedMessage object if provided.
    // As a fallback, we generate a new image and audio if one isn't provided.

    let imageDataUri = selectedMessage.imageUrl ?? '';
    if (!imageDataUri) {
        const imageDescription = `Generate a fun, vibrant, arcade-style image celebrating the completion of a game level. The theme is a birthday party. The image should be celebratory and family-friendly.`;
        const imageResult = await ai.generate({
          model: 'googleai/imagen-4.0-fast-generate-001',
          prompt: imageDescription,
        });
        imageDataUri = imageResult.media?.url ?? '';
    }

    let audioDataUri = selectedMessage.audioUrl ?? '';
    if (!audioDataUri) {
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

        if (audioResult.media) {
            const audioBuffer = Buffer.from(
                audioResult.media.url.substring(audioResult.media.url.indexOf(',') + 1),
                'base64'
              );
            audioDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));
        }
    }


    return {
      message: selectedMessage.message,
      imageDataUri: imageDataUri,
      audioDataUri: audioDataUri,
    };
  }
);
