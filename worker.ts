import MueckContext from 'lib/context'
import MueckDatabasePool from 'lib/pool'
import SlackChat from 'lib/slack/chat'
import SlackEvent from 'lib/slack/event'

const pool = new MueckDatabasePool()

const context: MueckContext = {
    pool,
}

const worker = async () => {
    while (true) {
        const event = await SlackEvent.fromNextUnprocessed(context)

        if (event) {
            console.log('Processing event:', event.event)

            const {
                api_app_id: appId,
                event: {
                    channel,
                    event_ts: eventTs,
                    thread_ts: threadTs,
                },
            } = event.event

            const response = await event.processEvent()
            const chat = new SlackChat(context)
            const parent = threadTs || eventTs

            const success = await chat.sendMessage(appId, channel, parent, response)

            if (success) {
                await event.markEventAsProcessed()
            } else {
                console.error('Failed to send message')
            }
        } else {
            console.log('No unprocessed events')
        }

        await new Promise((resolve) => setTimeout(resolve, 5000))
    }
}

worker()