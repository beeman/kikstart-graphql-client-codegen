import {
  ClientSideBasePluginConfig,
  ClientSideBaseVisitor,
  indentMultiline,
  LoadedFragment,
  RawClientSideBasePluginConfig,
} from '@graphql-codegen/visitor-plugin-common'

// import autoBind from 'auto-bind'
import { camelCase } from 'change-case'
import { GraphQLSchema, Kind, OperationDefinitionNode } from 'graphql'

export class GraphQLClientSDKVisitor extends ClientSideBaseVisitor<
  RawClientSideBasePluginConfig,
  ClientSideBasePluginConfig
> {
  private _operationsToInclude: {
    node: OperationDefinitionNode
    documentVariableName: string
    operationType: string
    operationResultType: string
    operationVariablesTypes: string
  }[] = []

  constructor(schema: GraphQLSchema, fragments: LoadedFragment[], rawConfig: RawClientSideBasePluginConfig) {
    super(schema, fragments, rawConfig, {})

    // autoBind(this)
  }

  public getImports(): string[] {
    const baseImports = super.getImports()
    const imports = ["import { GraphQLClient, KikstartGraphQLClientConfig } from 'kikstart-graphql-client';"]
    const hasOperations = this._collectedOperations.length > 0

    /* istanbul ignore if */
    if (!hasOperations) {
      return baseImports
    }

    return [...baseImports, ...imports]
  }

  protected buildOperation(
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationType: string,
    operationResultType: string,
    operationVariablesTypes: string,
  ): string {
    this._operationsToInclude.push({
      node,
      documentVariableName,
      operationType,
      operationResultType,
      operationVariablesTypes,
    })

    return ''
  }

  public get sdkClass(): string {
    const allPossibleActions = this._operationsToInclude
      .map((o) => {
        const optionalVariables =
          !o.node.variableDefinitions ||
          o.node.variableDefinitions.length === 0 ||
          o.node.variableDefinitions.every((v) => v.type.kind !== Kind.NON_NULL_TYPE || !!v.defaultValue)
        const doc = o.documentVariableName

        const isSubscription = o.operationType === 'Subscription'
        const methodName = `${isSubscription ? '' : 'async '}${camelCase(o.node.name.value)}`
        const methodParams = `variables${optionalVariables ? '?' : ''}: ${o.operationVariablesTypes}`
        const methodCommand = `this.client.run${o.operationType}(${doc}, variables)`
        const methodBody = isSubscription
          ? `return ${methodCommand}`
          : `const { data, errors } = await ${methodCommand};
  if (errors) {
    throw errors
  }
  return data.${camelCase(o.node.name.value)}`

        return [`${methodName}(${methodParams}) {`, methodBody, '}'].join('\n')
      })
      .map((s) => indentMultiline(s, 2))

    return [
      `export class GraphQLClientSDK {`,
      `client: GraphQLClient;`,
      `constructor(config: KikstartGraphQLClientConfig) {`,
      `  this.client = new GraphQLClient(config);`,
      `}`,
      allPossibleActions.join('\n\n'),
      `}`,
    ].join('\n')
  }
}
