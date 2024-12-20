import { WebClient } from '@slack/web-api'
import slackify from 'slackify-markdown'

import MueckContext from 'lib/context'
import SlackIntegration from 'lib/slack/integration'

class SlackChat {
    context: MueckContext

    constructor(context: MueckContext) {
        this.context = context
    }

    async sendMessage(appId: string, channelId: string, threadTs: string, message: string): Promise<boolean> {
        const integration = await SlackIntegration.fromAppId(this.context, appId)

        if (!integration) {
            throw new Error('Failed to find integration')
        }

        const client = new WebClient(integration.accessToken)
        const slackifiedMessage = slackify(message)

        const result = await client.chat.postMessage({
            channel: channelId,
            text: slackifiedMessage,
            thread_ts: threadTs,
        })

        return result.ok
    }
}

export default SlackChat