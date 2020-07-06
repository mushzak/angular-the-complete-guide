import {EventEmitter, Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Recipe} from "./recipe.model";
import {Ingredient} from "../shared/ingredients.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";

@Injectable()

export class RecipesService {

  private recipes: Recipe[] = [
    new Recipe('A test Recipe', 'This is description',
      'https://www.telegraph.co.uk/content/dam/food-and-drink/2019/01/11/TELEMMGLPICT000185036503_trans_NvBQzQNjv4BqodXSHHE-j78vyZ0iwRUmY_nuzprQ_mxVCWqrJBTJk3A.jpeg',
      [new Ingredient('test 1', 20), new Ingredient('test 2', 10)]
    ),
    new Recipe('Another Recipe', 'This is description',
      'data:image/jpeg;base64,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',
      [new Ingredient('test 3', 40), new Ingredient('test 4', 123)]
    )
  ]

  constructor(private slServide: ShoppingListService) {
  }

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    this.slServide.addIngredients(ingredients);
  }

  getRecipe(index: number){
    return this.recipes.slice()[index];
  }
}
