
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: "schema.gql",
    documents: ["app/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
    generates: {
        "lib/graphql/": {
            plugins: [],
            preset: "client",
            presetConfig: {
                gqlTagName: "gql",
            },
        },
    },
    ignoreNoDocuments: true,
};

export default config;
