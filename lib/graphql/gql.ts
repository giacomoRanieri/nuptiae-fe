/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetInvitation($id: ID!) {\n    invitation(id: $id) {\n      _id\n      recipient\n      confirmationStatus\n      phoneNumber\n      email\n      isInterestedInAccommodation\n      participants {\n        _id\n        name\n        lastName\n        age\n        celiac\n        vegetarian\n        vegan\n        intolerances\n      }\n    }\n  }\n": typeof types.GetInvitationDocument,
    "\n  mutation UpdateInvitation($id: ID!, $input: UpdateInvitationInput!) {\n    updateInvitation(id: $id, input: $input) {\n      _id\n      confirmationStatus\n      email\n      phoneNumber\n      isInterestedInAccommodation\n    }\n  }\n": typeof types.UpdateInvitationDocument,
    "\n  mutation UpdateParticipants($id: ID!, $input: UpdateInvitationParticipantsInput!) {\n    updateInvitationParticipants(id: $id, input: $input) {\n        _id\n        participants {\n            _id\n            name\n            lastName\n            age\n            intolerances\n            celiac\n            vegetarian\n            vegan\n        }\n    }\n  }\n": typeof types.UpdateParticipantsDocument,
};
const documents: Documents = {
    "\n  query GetInvitation($id: ID!) {\n    invitation(id: $id) {\n      _id\n      recipient\n      confirmationStatus\n      phoneNumber\n      email\n      isInterestedInAccommodation\n      participants {\n        _id\n        name\n        lastName\n        age\n        celiac\n        vegetarian\n        vegan\n        intolerances\n      }\n    }\n  }\n": types.GetInvitationDocument,
    "\n  mutation UpdateInvitation($id: ID!, $input: UpdateInvitationInput!) {\n    updateInvitation(id: $id, input: $input) {\n      _id\n      confirmationStatus\n      email\n      phoneNumber\n      isInterestedInAccommodation\n    }\n  }\n": types.UpdateInvitationDocument,
    "\n  mutation UpdateParticipants($id: ID!, $input: UpdateInvitationParticipantsInput!) {\n    updateInvitationParticipants(id: $id, input: $input) {\n        _id\n        participants {\n            _id\n            name\n            lastName\n            age\n            intolerances\n            celiac\n            vegetarian\n            vegan\n        }\n    }\n  }\n": types.UpdateParticipantsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetInvitation($id: ID!) {\n    invitation(id: $id) {\n      _id\n      recipient\n      confirmationStatus\n      phoneNumber\n      email\n      isInterestedInAccommodation\n      participants {\n        _id\n        name\n        lastName\n        age\n        celiac\n        vegetarian\n        vegan\n        intolerances\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetInvitation($id: ID!) {\n    invitation(id: $id) {\n      _id\n      recipient\n      confirmationStatus\n      phoneNumber\n      email\n      isInterestedInAccommodation\n      participants {\n        _id\n        name\n        lastName\n        age\n        celiac\n        vegetarian\n        vegan\n        intolerances\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateInvitation($id: ID!, $input: UpdateInvitationInput!) {\n    updateInvitation(id: $id, input: $input) {\n      _id\n      confirmationStatus\n      email\n      phoneNumber\n      isInterestedInAccommodation\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateInvitation($id: ID!, $input: UpdateInvitationInput!) {\n    updateInvitation(id: $id, input: $input) {\n      _id\n      confirmationStatus\n      email\n      phoneNumber\n      isInterestedInAccommodation\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateParticipants($id: ID!, $input: UpdateInvitationParticipantsInput!) {\n    updateInvitationParticipants(id: $id, input: $input) {\n        _id\n        participants {\n            _id\n            name\n            lastName\n            age\n            intolerances\n            celiac\n            vegetarian\n            vegan\n        }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateParticipants($id: ID!, $input: UpdateInvitationParticipantsInput!) {\n    updateInvitationParticipants(id: $id, input: $input) {\n        _id\n        participants {\n            _id\n            name\n            lastName\n            age\n            intolerances\n            celiac\n            vegetarian\n            vegan\n        }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;