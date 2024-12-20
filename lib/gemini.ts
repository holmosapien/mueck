import {
    ChatSession,
    GenerateContentResult,
    GenerativeModel,
    GoogleGenerativeAI,
    ModelParams,
    Part,
} from '@google/generative-ai'

export interface RequestMedia {
    data: string,
    mimeType: string,
}

class Gemini {
    model: GenerativeModel

    constructor() {
        const apiKey: string | undefined = process.env.GEMINI_API_KEY

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY must be defined")
        }

        const g = new GoogleGenerativeAI(apiKey)

        const modelParams: ModelParams = {
            model: 'gemini-2.0-flash-exp'
        }

        this.model = g.getGenerativeModel(modelParams)
    }

    async generateContent(prompt: string, media?: RequestMedia): Promise<GenerateContentResult> {
        let imagePart: Part | null = null

        if (media) {
            imagePart = {
                inlineData: {
                    data: media.data,
                    mimeType: media.mimeType,
                },
            }
        }

        const sanitizedPrompt: string = prompt + ' (Please keep the response less than 3000 characters)'

        const contentArgs = (imagePart)
            ? [sanitizedPrompt, imagePart]
            : sanitizedPrompt

        const result = this.model.generateContent(contentArgs)

        return result
    }

    async startChatSession(): Promise<ChatSession> {
        const session = this.model.startChat()

        return session
    }
}

export default Gemini