export type Recipe = {
  Name: string;
  url: string;
  Description: string | null;
  Author: string | null;
  Ingredients: string[];
  Method: string[];
};

export type List = {
  listId: number;
  title: string;
  recipes: Recipe[];
};
