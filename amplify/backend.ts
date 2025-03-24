import { clientDDBStream } from './functions/clientDDBStream/resource'
import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { storage } from './storage/resource'
import { Effect } from 'aws-cdk-lib/aws-iam'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Expiration, Stack } from 'aws-cdk-lib'
import { EventSourceMapping, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'
import { StartingPosition } from 'aws-cdk-lib/aws-lambda'
import { generateFashionItem } from './functions/generateFashnItem/resource'
import { fashnWebhook } from './functions/fashnWebhook/resource'
import {
	EventApi,
	AppSyncAuthorizationType,
	ChannelNamespace,
} from 'aws-cdk-lib/aws-appsync'
import { resizeImage } from './functions/resizeImage/resource'
import { EventType } from 'aws-cdk-lib/aws-s3'
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications'
const backend = defineBackend({
	auth,
	data,
	storage,
	clientDDBStream,
	generateFashionItem,
	fashnWebhook,
	resizeImage,
})

const fashnWebhookLambdaFurl =
	backend.fashnWebhook.resources.lambda.addFunctionUrl({
		authType: FunctionUrlAuthType.NONE,
	})

backend.generateFashionItem.addEnvironment(
	'FASHN_WEBHOOK_URL',
	fashnWebhookLambdaFurl.url
)

const clientTable = backend.data.resources.tables['Client']

backend.clientDDBStream.resources.lambda.addToRolePolicy(
	new PolicyStatement({
		effect: Effect.ALLOW,
		actions: [
			'dynamodb:DescribeStream',
			'dynamodb:GetRecords',
			'dynamodb:GetShardIterator',
			'dynamodb:ListStreams',
		],
		resources: ['*'],
	})
)

new EventSourceMapping(
	Stack.of(clientTable),
	'MyDynamoDBFunctionClientEventStreamMapping',
	{
		target: backend.clientDDBStream.resources.lambda,
		eventSourceArn: clientTable.tableStreamArn,
		startingPosition: StartingPosition.LATEST,
	}
)

const fashnEventApi = new EventApi(Stack.of(backend.data), 'FashnEventApi', {
	apiName: 'FashnEventApi',
	authorizationConfig: {
		authProviders: [
			{
				authorizationType: AppSyncAuthorizationType.API_KEY,
				apiKeyConfig: {
					expires: Expiration.atDate(new Date('2025-04-15')),
					description: 'Fashn API Key',
				},
			},
			{
				authorizationType: AppSyncAuthorizationType.IAM,
			},
			{
				authorizationType: AppSyncAuthorizationType.USER_POOL,
				cognitoConfig: {
					userPool: backend.auth.resources.userPool,
				},
			},
		],
		connectionAuthModeTypes: [
			AppSyncAuthorizationType.USER_POOL,
			AppSyncAuthorizationType.API_KEY,
		],
		defaultSubscribeAuthModeTypes: [
			AppSyncAuthorizationType.USER_POOL,
			AppSyncAuthorizationType.API_KEY,
		],
		defaultPublishAuthModeTypes: [AppSyncAuthorizationType.IAM],
	},
})

const fashnChannelNamespace = new ChannelNamespace(
	Stack.of(fashnEventApi),
	'FashnChannelNamespace',
	{
		api: fashnEventApi,
		channelNamespaceName: 'fashn',
	}
)

backend.fashnWebhook.resources.lambda.addToRolePolicy(
	new PolicyStatement({
		effect: Effect.ALLOW,
		actions: ['appsync:EventPublish'],
		resources: [fashnChannelNamespace.channelNamespaceArn],
	})
)

backend.fashnWebhook.addEnvironment(
	'FASHN_EVENT_API_URL',
	`https://${fashnEventApi.httpDns}/event`
)
backend.fashnWebhook.addEnvironment(
	'DEFAULT_AUTHORIZATION_TYPE',
	AppSyncAuthorizationType.IAM
)

backend.storage.resources.bucket.addEventNotification(
	EventType.OBJECT_CREATED_PUT,
	new LambdaDestination(backend.resizeImage.resources.lambda),
	{
		prefix: 'stylist-images/catalog/',
	}
)
backend.storage.resources.bucket.addEventNotification(
	EventType.OBJECT_CREATED_PUT,
	new LambdaDestination(backend.resizeImage.resources.lambda),
	{
		prefix: 'client-images/',
	}
)

backend.addOutput({
	custom: {
		events: {
			url: `https://${fashnEventApi.httpDns}/event`,
			aws_region: backend.stack.region,
			default_authorization_type: AppSyncAuthorizationType.USER_POOL,
		},
	},
})
