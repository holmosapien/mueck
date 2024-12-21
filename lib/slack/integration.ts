import MueckContext from 'lib/context'

import { saveIntegration, getIntegrationById, getIntegrationByAppId } from 'lib/database'
import { SlackIntegrationRecord } from 'lib/records'

class SlackIntegration {
    context: MueckContext
    record: SlackIntegrationRecord

    get id(): number {
        return this.record.id
    }

    get accountId(): number {
        return this.record.accountId
    }

    get slackClientId(): number {
        return this.record.slackClientId
    }

    get teamId(): string {
        return this.record.teamId
    }

    get teamName(): string {
        return this.record.teamName
    }

    get botUserId(): string {
        return this.record.botUserId
    }

    get appId(): string {
        return this.record.appId
    }

    get accessToken(): string {
        return this.record.accessToken
    }

    get created(): string {
        return this.record.created
    }

    constructor(
        context: MueckContext,
        slackIntegrationRecord: SlackIntegrationRecord,
    ) {
        this.context = context
        this.record = slackIntegrationRecord
    }

    static async fromId(context: MueckContext, slackIntegrationId: number): Promise<SlackIntegration> {
        const integrationRecord = await getIntegrationById(context, slackIntegrationId)

        if (!integrationRecord) {
            throw new Error('Failed to find integration')
        }

        return new this(context, integrationRecord)
    }

    static async fromAppId(context: MueckContext, appId: string): Promise<SlackIntegration> {
        const integrationRecord = await getIntegrationByAppId(context, appId)

        if (!integrationRecord) {
            throw new Error('Failed to find integration')
        }

        return new this(context, integrationRecord)
    }

    async createIntegration(): Promise<void> {
        const integrationRecord = await saveIntegration(
            this.context,
            this.accountId,
            this.slackClientId,
            this.teamId,
            this.teamName,
            this.botUserId,
            this.accessToken,
            this.appId,
        )

        this.record = integrationRecord
    }
}

export default SlackIntegration