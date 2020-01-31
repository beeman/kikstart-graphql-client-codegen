import { compileTs } from '@graphql-codegen/testing'
import { plugin } from '../index'
import { parse, buildClientSchema } from 'graphql'
import { Types, mergeOutputs } from '@graphql-codegen/plugin-helpers'
import { plugin as tsPlugin } from '@graphql-codegen/typescript'
import { plugin as tsDocumentsPlugin } from '@graphql-codegen/typescript-operations'
import { readFileSync } from 'fs'

const uri = 'http://localhost:4567'
const wsUri = 'ws://localhost:4567'

describe('graphql-client-dk', () => {
  const schema = buildClientSchema(JSON.parse(readFileSync(`${__dirname}/githunt-schema.json`).toString()))
  const basicDoc = parse(/* GraphQL */ `
    query feed {
      feed {
        id
        commentCount
        repository {
          owner {
            avatar_url
          }
        }
      }
    }

    query feed2($v: String!) {
      feed {
        id
      }
    }

    query feed3($v: String) {
      feed {
        id
      }
    }

    query feed4($v: String! = "TEST") {
      feed {
        id
      }
    }

    subscription test($name: String) {
      commentAdded(repoFullName: $name) {
        id
      }
    }
  `)

  const validateAndCompile = async (content: Types.PluginOutput, config, docs, pluginSchema, usage = '') => {
    const m = mergeOutputs([
      await tsPlugin(pluginSchema, docs, config, { outputFile: '' }),
      await tsDocumentsPlugin(pluginSchema, docs, config, { outputFile: '' }),
      content,
      usage,
    ])

    await compileTs(m)

    return m
  }

  describe('sdk', () => {
    it('Should generate an SDK class', async () => {
      const config = {}
      const docs = [{ filePath: '', document: basicDoc }]
      const result = (await plugin(schema, docs, config, {
        outputFile: 'graphql.ts',
      })) as Types.ComplexPluginOutput

      const usage = `
async function test() {
  const client = new GraphQLClientSDK({
    uri: '${uri}',
    wsUri: '${wsUri}',
  });

  await client.feed();
  await client.feed3();
  await client.feed4();

  const result = await client.feed2({ v: "1" });

  if (result.feed) {
    if (result.feed[0]) {
      const id = result.feed[0].id
    }
  }
}`
      const output = await validateAndCompile(result, config, docs, schema, usage)

      expect(output).toMatchSnapshot()
    })
  })
})
