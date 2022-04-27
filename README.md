## Development

Follow the steps to run it locally.

1. Copy `.env.example` to `.env`
2. Run `postgres` locally, the easiest way on mac is `brew install postgresql`, you can also use docker
3. Install dependencies: `pnpm i`
4. Initialize the database by running `pnpm prisma db push`
5. Start dev server: `pnpm dev`

## Architecture

### GraphQL API

We automatically generate a GraphQL schema from `server/resolvers/*.resolver.ts`, powered by [TypeGraphQL](https://typegraphql.com/).

### Fetching GraphQL API

In the Next.js app, we fetch the API using [urql](https://formidable.com/open-source/urql/), we generate relevant React hooks from `src/graphql/*.graphql` by running `pnpm gql-gen`. For example `src/graphql/createPost.graphql` can be used as:

```ts
import { useCreatePostMutation } from "$src/generated/graphql"
```
