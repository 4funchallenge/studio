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
  userMessages: z.array(z.string()).describe('Array of user messages.'),
  levelMessages: z.array(z.string()).describe('Array of level completion messages.'),
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
  output: {schema: PersonalizedMessageOutputSchema},
  prompt: `You are an AI assistant that generates personalized level completion messages for a birthday-themed arcade game.\n\n  The player has just completed level {{{levelCompleted}}}.\n  Here are some user messages: {{{userMessages}}}.\n  Here are some generic level completion messages: {{{levelMessages}}}.\n\n  Create a single personalized level completion message that incorporates elements from the user messages and the generic level completion messages. The message should be short and encouraging.\n  Also generate a description of an image that would be appropriate for the message and the game.\n  Also generate a short text prompt for an audio clip that would be appropriate for the message and the game.  The audio clip should be short, upbeat, and celebratory.\n\n  Make sure that the imageDataUri and audioDataUri are not empty.\n  Return the personalized message, an image data URI, and an audio data URI. The image and audio should be relevant to the level and messages.\n  For multi-speaker TTS scenario, make sure that the speakers are Speaker1 for messages and sounds that a kid would make, and Speaker2 for messages and sounds that an adult would make.\n  Speaker1 should have a high pitched voice and Speaker2 should have a lower pitched voice.\n  The overall tone should be celebratory.\n  \n  Format the output as a JSON object.
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
    const promptResult = await prompt(input);
    const {message} = promptResult.output!;

    // Generate the image
    const imageDescription = `Generate an image relevant to this message and game: ${message}`;
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
      message: promptResult.output!.message,
      imageDataUri: imageResult.media!.url,
      audioDataUri: audioDataUri,
    };
  }
);
