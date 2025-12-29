export interface Tag {
  id: string;
  name: string;
  type: string;
  color: string;
}

export interface Ingredient {
  id: string;
  name: string;
  unitOfMeasure: string;
  pricePerUnit: number;
}

export interface RecipeIngredient {
  id: string;
  ingredient: string;
  quantity: number;
  notes?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  instructions: string;
  preparationTime: number;
  difficulty: string;
  servings: number;
  recipeIngredients: RecipeIngredient[];
  tags: string[];
}
