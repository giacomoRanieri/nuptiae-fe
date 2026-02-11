/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum Age {
  Adult = 'ADULT',
  Child = 'CHILD',
  Infant = 'INFANT'
}

export enum ConfirmationStatus {
  Confirmed = 'CONFIRMED',
  NotAttending = 'NOT_ATTENDING',
  Pending = 'PENDING'
}

export type CreateInvitationInput = {
  recipient: Scalars['String']['input'];
};

export type InvitationDto = {
  __typename?: 'InvitationDto';
  _id: Scalars['ID']['output'];
  confirmationStatus: ConfirmationStatus;
  contactPersonId?: Maybe<Scalars['ID']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  isInterestedInAccommodation: Scalars['Boolean']['output'];
  participants: Array<ParticipantDto>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  recipient: Scalars['String']['output'];
  secret?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createInvitation: InvitationDto;
  updateInvitation: InvitationDto;
  updateInvitationParticipants: InvitationDto;
};


export type MutationCreateInvitationArgs = {
  input: CreateInvitationInput;
};


export type MutationUpdateInvitationArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input: UpdateInvitationInput;
};


export type MutationUpdateInvitationParticipantsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input: UpdateInvitationParticipantsInput;
};

export type ParticipantDto = {
  __typename?: 'ParticipantDto';
  _id: Scalars['ID']['output'];
  age: Age;
  celiac: Scalars['Boolean']['output'];
  intolerances: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  vegan: Scalars['Boolean']['output'];
  vegetarian: Scalars['Boolean']['output'];
};

export type ParticipantInput = {
  _id?: InputMaybe<Scalars['ID']['input']>;
  age: Age;
  celiac?: InputMaybe<Scalars['Boolean']['input']>;
  intolerances?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  name: Scalars['String']['input'];
  vegan?: InputMaybe<Scalars['Boolean']['input']>;
  vegetarian?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Query = {
  __typename?: 'Query';
  invitation?: Maybe<InvitationDto>;
  invitations: Array<InvitationDto>;
};


export type QueryInvitationArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateInvitationInput = {
  confirmationStatus?: ConfirmationStatus;
  email?: InputMaybe<Scalars['String']['input']>;
  isInterestedInAccommodation?: InputMaybe<Scalars['Boolean']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  recipient?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateInvitationParticipantsInput = {
  contactPersonId?: InputMaybe<Scalars['ID']['input']>;
  participants: Array<ParticipantInput>;
};

export type GetInvitationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetInvitationQuery = { __typename?: 'Query', invitation?: { __typename?: 'InvitationDto', _id: string, recipient: string, confirmationStatus: ConfirmationStatus, phoneNumber?: string | null, email?: string | null, isInterestedInAccommodation: boolean, participants: Array<{ __typename?: 'ParticipantDto', _id: string, name: string, lastName: string, age: Age, celiac: boolean, vegetarian: boolean, vegan: boolean, intolerances: string }> } | null };

export type UpdateInvitationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateInvitationInput;
}>;


export type UpdateInvitationMutation = { __typename?: 'Mutation', updateInvitation: { __typename?: 'InvitationDto', _id: string, confirmationStatus: ConfirmationStatus, email?: string | null, phoneNumber?: string | null, isInterestedInAccommodation: boolean } };

export type UpdateParticipantsMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateInvitationParticipantsInput;
}>;


export type UpdateParticipantsMutation = { __typename?: 'Mutation', updateInvitationParticipants: { __typename?: 'InvitationDto', _id: string, participants: Array<{ __typename?: 'ParticipantDto', _id: string, name: string, lastName: string, age: Age, intolerances: string, celiac: boolean, vegetarian: boolean, vegan: boolean }> } };


export const GetInvitationDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "GetInvitation" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "id" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "ID" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "invitation" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "id" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "id" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "_id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "recipient" } }, { "kind": "Field", "name": { "kind": "Name", "value": "confirmationStatus" } }, { "kind": "Field", "name": { "kind": "Name", "value": "phoneNumber" } }, { "kind": "Field", "name": { "kind": "Name", "value": "email" } }, { "kind": "Field", "name": { "kind": "Name", "value": "isInterestedInAccommodation" } }, { "kind": "Field", "name": { "kind": "Name", "value": "participants" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "_id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "name" } }, { "kind": "Field", "name": { "kind": "Name", "value": "lastName" } }, { "kind": "Field", "name": { "kind": "Name", "value": "age" } }, { "kind": "Field", "name": { "kind": "Name", "value": "celiac" } }, { "kind": "Field", "name": { "kind": "Name", "value": "vegetarian" } }, { "kind": "Field", "name": { "kind": "Name", "value": "vegan" } }, { "kind": "Field", "name": { "kind": "Name", "value": "intolerances" } }] } }] } }] } }] } as unknown as DocumentNode<GetInvitationQuery, GetInvitationQueryVariables>;
export const UpdateInvitationDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "mutation", "name": { "kind": "Name", "value": "UpdateInvitation" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "id" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "ID" } } } }, { "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "UpdateInvitationInput" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "updateInvitation" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "id" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "id" } } }, { "kind": "Argument", "name": { "kind": "Name", "value": "input" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "_id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "confirmationStatus" } }, { "kind": "Field", "name": { "kind": "Name", "value": "email" } }, { "kind": "Field", "name": { "kind": "Name", "value": "phoneNumber" } }, { "kind": "Field", "name": { "kind": "Name", "value": "isInterestedInAccommodation" } }] } }] } }] } as unknown as DocumentNode<UpdateInvitationMutation, UpdateInvitationMutationVariables>;
export const UpdateParticipantsDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "mutation", "name": { "kind": "Name", "value": "UpdateParticipants" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "id" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "ID" } } } }, { "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "UpdateInvitationParticipantsInput" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "updateInvitationParticipants" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "id" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "id" } } }, { "kind": "Argument", "name": { "kind": "Name", "value": "input" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "_id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "participants" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "_id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "name" } }, { "kind": "Field", "name": { "kind": "Name", "value": "lastName" } }, { "kind": "Field", "name": { "kind": "Name", "value": "age" } }, { "kind": "Field", "name": { "kind": "Name", "value": "intolerances" } }, { "kind": "Field", "name": { "kind": "Name", "value": "celiac" } }, { "kind": "Field", "name": { "kind": "Name", "value": "vegetarian" } }, { "kind": "Field", "name": { "kind": "Name", "value": "vegan" } }] } }] } }] } }] } as unknown as DocumentNode<UpdateParticipantsMutation, UpdateParticipantsMutationVariables>;