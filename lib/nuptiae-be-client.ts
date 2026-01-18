
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/client-integration-nextjs";
import { cookies } from "next/headers";

export const { getClient } = registerApolloClient(async () => {
  const cookieStore = await cookies();
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      headers: {
        Cookie: cookieStore.toString(),
      },
    }),
  });
});
