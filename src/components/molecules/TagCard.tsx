import { Tag } from "@/src/types";
import { MdEdit, MdDelete } from "react-icons/md";

interface TagCardProps {
  tag: Tag;
  onEdit: (tag: Tag) => void;
  onDelete: (id: string) => void;
}

export default function TagCard({ tag, onEdit, onDelete }: TagCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
          style={{ backgroundColor: tag.color }}
        ></div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {tag.name}
        </h3>
      </div>

      <div className="grid grid-cols-2 w-full gap-2 pt-3 border-t dark:border-gray-700">
        <button
          onClick={() => onEdit(tag)}
          className="flex justify-center items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition text-sm"
        >
          <MdEdit /> Editar
        </button>
        <button
          onClick={() => onDelete(tag.id)}
          className="flex justify-center items-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-sm"
        >
          <MdDelete /> Eliminar
        </button>
      </div>
    </div>
  );
}
