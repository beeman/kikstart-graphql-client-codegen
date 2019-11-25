import { Types, PluginValidateFn, PluginFunction } from '@graphql-codegen/plugin-helpers'
import { visit, GraphQLSchema, concatAST, Kind, FragmentDefinitionNode } from 'graphql'
import { RawClientSideBasePluginConfig, LoadedFragment } from '@graphql-codegen/visitor-plugin-common'
import { GraphQLClientSDKVisitor } from './graphql-client-sdk-visitor'
import { extname } from 'path'

export const plugin: PluginFunction<RawClientSideBasePluginConfig> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: RawClientSideBasePluginConfig,
) => {
  const allAst = concatAST(
    documents.reduce((prev, v) => {
      return [...prev, v.content]
    }, []),
  )

  const allFragments: LoadedFragment[] = [
    ...(allAst.definitions.filter((d) => d.kind === Kind.FRAGMENT_DEFINITION) as FragmentDefinitionNode[]).map(
      /* istanbul ignore next */
      (fragmentDef) => ({
        node: fragmentDef,
        name: fragmentDef.name.value,
        onType: fragmentDef.typeCondition.name.value,
        isExternal: false,
      }),
    ),
    ...(config.externalFragments || []),
  ]

  const visitor = new GraphQLClientSDKVisitor(schema, allFragments, config) as any
  const visitorResult = visit(allAst, { leave: visitor })

  return {
    prepend: visitor.getImports(),
    content: [
      visitor.fragments,
      ...visitorResult.definitions.filter((t) => typeof t === 'string'),
      visitor.sdkClass,
    ].join('\n'),
  }
}

export const validate: PluginValidateFn<any> = async (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: RawClientSideBasePluginConfig,
  outputFile: string,
) => {
  /* istanbul ignore next */
  if (extname(outputFile) !== '.ts') {
    throw new Error(`Plugin "graphql-client-sdk" requires extension to be ".ts"!`)
  }
}

export { GraphQLClientSDKVisitor }
