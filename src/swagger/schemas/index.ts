import { userSchemas } from './user.schemas';
import { authSchemas } from './auth.schemas';
import { commonSchemas } from './common.schemas';

export const allSchemas = {
  ...userSchemas,
  ...authSchemas,
  ...commonSchemas,
};

export { userSchemas, authSchemas, commonSchemas };
