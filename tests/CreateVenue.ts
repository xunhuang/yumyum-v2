import { FetchResult, OperationVariables } from '@apollo/client';

import { CreateVenueDocument, CreateVenueMutation } from '../graphql/generated/graphql';
import { client } from './graphql.test';

export async function CreateVenue(variables: OperationVariables): Promise<FetchResult<any>> {
  const result = await client.mutate<CreateVenueMutation>({
    mutation: CreateVenueDocument, variables: variables
  });
  return result;
}
