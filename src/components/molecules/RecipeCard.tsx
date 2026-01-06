import { Recipe } from "@/src/types";
import { MdEdit, MdDelete } from "react-icons/md";

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
  getIngredientName: (id: string) => string;
  getTagName: (id: string) => string;
}

export default function RecipeCard({
  recipe,
  onEdit,
  onDelete,
  onClick,
  getIngredientName,
  getTagName,
}: RecipeCardProps) {
  return (
    <div
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(recipe.id)}
    >
      <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">
        {recipe.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
        {recipe.description}
      </p>

      <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
          <p className="text-gray-500 dark:text-gray-400 text-xs">Tiempo</p>
          <p className="font-semibold dark:text-gray-100">
            {recipe.preparationTime} min
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
          <p className="text-gray-500 dark:text-gray-400 text-xs">Dificultad</p>
          <p className="font-semibold dark:text-gray-100">
            {recipe.difficulty}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
          <p className="text-gray-500 dark:text-gray-400 text-xs">Porciones</p>
          <p className="font-semibold dark:text-gray-100">{recipe.servings}</p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Ingredientes
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
          {recipe.recipeIngredients
            .map((ri) => getIngredientName(ri.ingredient))
            .join(", ")}
        </p>
      </div>

      {recipe.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {recipe.tags.map((tagId) => (
              <span
                key={tagId}
                className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs px-2 py-1 rounded"
              >
                {getTagName(tagId)}
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        className="grid grid-cols-2 w-full gap-2 pt-3 border-t dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit(recipe)}
          className="flex justify-center items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition text-sm"
        >
          <MdEdit /> Editar
        </button>
        <button
          onClick={() => onDelete(recipe.id)}
          className="flex justify-center items-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-sm"
        >
          <MdDelete /> Eliminar
        </button>
      </div>
    </div>
  );
}
