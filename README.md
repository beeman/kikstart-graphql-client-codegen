# kikstart-graphql-client-codegen

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/beeman/kikstart-graphql-client-codegen.svg)
![GitHub repo size](https://img.shields.io/github/repo-size/beeman/kikstart-graphql-client-codegen.svg)
![npm](https://img.shields.io/npm/dw/kikstart-graphql-client-codegen.svg)
![npm](https://img.shields.io/npm/dm/kikstart-graphql-client-codegen.svg)
![npm](https://img.shields.io/npm/dy/kikstart-graphql-client-codegen.svg)
![npm](https://img.shields.io/npm/dt/kikstart-graphql-client-codegen.svg)
![NPM](https://img.shields.io/npm/l/kikstart-graphql-client-codegen.svg)
![npm](https://img.shields.io/npm/v/kikstart-graphql-client-codegen.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/beeman/kikstart-graphql-client-codegen.svg)
![npm collaborators](https://img.shields.io/npm/collaborators/kikstart-graphql-client-codegen.svg)

A boilerplate repo for publishing typescript packages to npm

## Usage

Some notes on how to use this repo. Some day I'll hopefully automate the biggest part of this.

### Clone the repo or [generate](https://github.com/beeman/kikstart-graphql-client-codegen/generate) your repo:

```shell script
npx degit https://github.com/beeman/kikstart-graphql-client-codegen my-new-package
```

### Initialize the new project


```shell script
cd my-new-package
yarn # to install the deps
git init # to initialize a new Git repo
# Manually create a remote repo and follow the instructions OR:
hub create # Use this amazing tool called 'hub': https://github.com/github/hub
```

#### Update meta data:

Update the following fields in `package.json`:

- name
- description
- repository
- keywords
- author
- license
- bugs
- homepage

Make sure to don't change the `version` property, versioning this package is handled by `semantic-release`!

#### Update README

Basically you want to search/replace the repo and package name to match your repo/package name and add any new info.

### Getting the GitHub and NPM tokens

#### GitHub

- Log in to GitHub.
- Navigate to [https://github.com/settings/tokens](https://github.com/settings/tokens).
- Click `Generate new token`.
- Fill in the `note` field so you remember what the token is for.
- Select the `write:packages` scope. This will also enable the `repo` and `read:packages` scopes.
- Click `Generate token`.
- Copy the code and store it to use in the next step.

#### NPM

- Log in to NPM.
- Click the Tokens link from the top-right menu.
- Click Create New Token
- Select `Read and Publish` then click `Create Token`.
- Copy the code and store it to use in the next step.

### Setting the GitHub and NPM tokens

- Open your new repo on GitHub.
- Navigate to `Settings` then `Secrets`.
- Click `Add a new secret`.
- Add the `GH_TOKEN` secret with the GitHub token.
- Click `Add a new secret` again.
- Add the `NPM_TOKEN` secret with the NPM token.

Your repo is now set up to publish packages to NPM and the GitHub Package Registry.

### Write your code

Write your amazing new code and make sure to update the tests!

You can run `yarn lint` and `yarn test` to check if your project will pass CI.

### Publish it

With a `git push` you will create a new version and publish it to `npm`.

```shell script
git commit -m "feat: initial commit"
git push origin master 
```

## Credits

Based on [npm-typescript-package-boilerplate](https://github.com/93v/npm-typescript-package-boilerplate) with a few changes.

## MIT License
