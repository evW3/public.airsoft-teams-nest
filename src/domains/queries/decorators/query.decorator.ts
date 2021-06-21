import { SetMetadata } from '@nestjs/common';

import { QUERY_KEY } from '../../../constants';

export const CreateQuery = (queryType: string) => SetMetadata(QUERY_KEY, queryType);