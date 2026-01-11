import { Ingredient } from "@/src/types";
import { MdEdit, MdDelete } from "react-icons/md";

interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: string) => void;
}

export default function IngredientCard({
  ingredient,
  onEdit,
  onDelete,
}: IngredientCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">
        {ingredient.name}
      </h3>

      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
          <p className="text-gray-500 dark:text-gray-400 text-xs">Unidad</p>
          <p className="font-semibold dark:text-gray-100">
            {ingredient.unitOfMeasure}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
          <p className="text-gray-500 dark:text-gray-400 text-xs">Precio</p>
          <p className="font-semibold dark:text-gray-100">
            ${ingredient.pricePerUnit}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 w-full gap-2 pt-3 border-t dark:border-gray-700">
        <button
          onClick={() => onEdit(ingredient)}
          className="flex justify-center items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition text-sm"
        >
          <MdEdit /> Editar
        </button>
        <button
          onClick={() => onDelete(ingredient.id)}
          className="flex justify-center items-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-sm"
        >
          <MdDelete /> Eliminar
        </button>
      </div>
    </div>
  );
}
