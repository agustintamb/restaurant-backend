import { userSchemas } from './user.schemas';
import { authSchemas } from './auth.schemas';
import { allergenSchemas } from './allergen.schemas';
import { categorySchemas } from './category.schemas';
import { contactSchemas } from './contact.schemas';
import { dishSchemas } from './dish.schemas';
import { ingredientSchemas } from './ingredient.schemas';
import { subcategorySchemas } from './subcategory.schemas';
import { dashboardSchemas } from './dashboard.schemas';
import { commonSchemas } from './common.schemas';

export const allSchemas = {
  ...userSchemas,
  ...authSchemas,
  ...allergenSchemas,
  ...categorySchemas,
  ...contactSchemas,
  ...dishSchemas,
  ...ingredientSchemas,
  ...subcategorySchemas,
  ...dashboardSchemas,
  ...commonSchemas,
};

export {
  userSchemas,
  authSchemas,
  allergenSchemas,
  categorySchemas,
  contactSchemas,
  dishSchemas,
  ingredientSchemas,
  subcategorySchemas,
  dashboardSchemas,
  commonSchemas,
};
