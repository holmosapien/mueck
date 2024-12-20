interface SlackClientRecord {
    id: number
    apiClientId: string
    apiClientSecret: string
    name: string
    created: string
}

interface AuthorizationStateRecord {
    stateId: number
    accountId: number
    slackClientRecord: SlackClientRecord
}

interface SlackIntegrationRecord {
    id: number
    accountId: number
    slackClientId: number
    teamId: string
    teamName: string
    botUserId: string
    accessToken: string
    appId: string
    created: string
}

interface SlackEventRecord {
    id: number
    slackIntegrationId: number
    event: any
    created: string
    processed: string | null
}

export {
    SlackClientRecord,
    AuthorizationStateRecord,
    SlackIntegrationRecord,
    SlackEventRecord,
}