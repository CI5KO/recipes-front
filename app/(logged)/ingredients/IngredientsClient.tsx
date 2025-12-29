"use client";

import { useState, useEffect } from "react";
import { Ingredient } from "@/src/types";
import { storageUtils } from "@/src/lib/storage";
import { createIngredient, updateIngredient, deleteIngredient } from "@/src/services/ingredient.service";

export default function IngredientsClient() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [formData, setFormData] = useState({ name: "", unitOfMeasure: "", pricePerUnit: 0 });

  useEffect(() => {
    setIngredients(storageUtils.getIngredients());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIngredient) {
      const updated = await updateIngredient(editingIngredient.id, formData);
      if (updated) {
        const newIngredients = ingredients.map(i => i.id === editingIngredient.id ? updated : i);
        setIngredients(newIngredients);
        storageUtils.setIngredients(newIngredients);
      }
    } else {
      const newIngredient = await createIngredient(formData);
      const newIngredients = [...ingredients, newIngredient];
      setIngredients(newIngredients);
      storageUtils.setIngredients(newIngredients);
    }
    setIsModalOpen(false);
    setFormData({ name: "", unitOfMeasure: "", pricePerUnit: 0 });
    setEditingIngredient(null);
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({ name: ingredient.name, unitOfMeasure: ingredient.unitOfMeasure, pricePerUnit: ingredient.pricePerUnit });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteIngredient(id);
    const newIngredients = ingredients.filter(i => i.id !== id);
    setIngredients(newIngredients);
    storageUtils.setIngredients(newIngredients);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ingredientes</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Crear Ingrediente</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-black">Nombre</th>
              <th className="border p-2 text-black">Unidad</th>
              <th className="border p-2 text-black">Precio</th>
              <th className="border p-2 text-black">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map(ingredient => (
              <tr key={ingredient.id}>
                <td className="border p-2">{ingredient.name}</td>
                <td className="border p-2">{ingredient.unitOfMeasure}</td>
                <td className="border p-2">${ingredient.pricePerUnit}</td>
                <td className="border p-2">
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => handleEdit(ingredient)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Editar</button>
                    <button onClick={() => handleDelete(ingredient.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-black">{editingIngredient ? "Editar Ingrediente" : "Crear Ingrediente"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-black">Nombre</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded px-3 py-2 text-black" required />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-black">Unidad de Medida</label>
                <input type="text" value={formData.unitOfMeasure} onChange={e => setFormData({...formData, unitOfMeasure: e.target.value})} className="w-full border rounded px-3 py-2 text-black" required />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-black">Precio por Unidad</label>
                <input type="number" step="0.01" value={formData.pricePerUnit} onChange={e => setFormData({...formData, pricePerUnit: parseFloat(e.target.value)})} className="w-full border rounded px-3 py-2 text-black" required />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar</button>
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingIngredient(null); setFormData({ name: "", unitOfMeasure: "", pricePerUnit: 0 }); }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
