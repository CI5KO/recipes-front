"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Recipe, RecipeIngredient, Ingredient, Tag } from "@/src/types";
import { storageUtils } from "@/src/lib/storage";
import { createRecipe, updateRecipe, deleteRecipe } from "@/src/services/recipes.service";

export default function RecipesClient() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructions: "",
    preparationTime: 0,
    difficulty: "",
    servings: 1,
    recipeIngredients: [] as RecipeIngredient[],
    tags: [] as string[]
  });

  useEffect(() => {
    setRecipes(storageUtils.getRecipes());
    setIngredients(storageUtils.getIngredients());
    setTags(storageUtils.getTags());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecipe) {
      const updated = await updateRecipe(editingRecipe.id, formData);
      if (updated) {
        const newRecipes = recipes.map(r => r.id === editingRecipe.id ? updated : r);
        setRecipes(newRecipes);
        storageUtils.setRecipes(newRecipes);
      }
    } else {
      const newRecipe = await createRecipe(formData);
      const newRecipes = [...recipes, newRecipe];
      setRecipes(newRecipes);
      storageUtils.setRecipes(newRecipes);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecipe(null);
    setFormData({
      name: "",
      description: "",
      instructions: "",
      preparationTime: 0,
      difficulty: "",
      servings: 1,
      recipeIngredients: [],
      tags: []
    });
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormData(recipe);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteRecipe(id);
    const newRecipes = recipes.filter(r => r.id !== id);
    setRecipes(newRecipes);
    storageUtils.setRecipes(newRecipes);
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      recipeIngredients: [...formData.recipeIngredients, { id: crypto.randomUUID(), ingredient: "", quantity: 0, notes: "" }]
    });
  };

  const removeIngredient = (id: string) => {
    setFormData({
      ...formData,
      recipeIngredients: formData.recipeIngredients.filter(ri => ri.id !== id)
    });
  };

  const updateIngredientField = (id: string, field: keyof RecipeIngredient, value: any) => {
    setFormData({
      ...formData,
      recipeIngredients: formData.recipeIngredients.map(ri => ri.id === id ? { ...ri, [field]: value } : ri)
    });
  };

  const toggleTag = (tagId: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.includes(tagId) ? formData.tags.filter(t => t !== tagId) : [...formData.tags, tagId]
    });
  };

  const getIngredientName = (id: string) => ingredients.find(i => i.id === id)?.name || "Desconocido";
  const getTagName = (id: string) => tags.find(t => t.id === id)?.name || "Desconocido";

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recetas</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Crear Receta</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map(recipe => (
          <div key={recipe.id} className="border rounded-lg p-4 shadow cursor-pointer hover:shadow-lg transition" onClick={() => router.push(`/recipes/${recipe.id}`)}>
            <h3 className="font-bold text-xl mb-2">{recipe.name}</h3>
            <p className="text-gray-600 mb-2">{recipe.description}</p>
            <div className="text-sm mb-2">
              <p>Tiempo: {recipe.preparationTime} min | Dificultad: {recipe.difficulty} | Porciones: {recipe.servings}</p>
            </div>
            <div className="mb-2">
              <strong>Ingredientes:</strong> {recipe.recipeIngredients.map(ri => getIngredientName(ri.ingredient)).join(", ")}
            </div>
            <div className="mb-4">
              <strong>Tags:</strong> {recipe.tags.map(t => getTagName(t)).join(", ")}
            </div>
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => handleEdit(recipe)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Editar</button>
              <button onClick={() => handleDelete(recipe.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
            <h2 className="text-2xl font-bold mb-4 text-black">{editingRecipe ? "Editar Receta" : "Crear Receta"}</h2>
            <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
              <div className="mb-4">
                <label className="block mb-2 text-black">Nombre</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded px-3 py-2 text-black" required />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-black">Descripción</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded px-3 py-2 text-black" required />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-black">Instrucciones</label>
                <textarea value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})} className="w-full border rounded px-3 py-2 text-black" rows={4} required />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block mb-2 text-black">Tiempo (min)</label>
                  <input type="number" value={formData.preparationTime} onChange={e => setFormData({...formData, preparationTime: parseInt(e.target.value)})} className="w-full border rounded px-3 py-2 text-black" required />
                </div>
                <div>
                  <label className="block mb-2 text-black">Dificultad</label>
                  <input type="text" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})} className="w-full border rounded px-3 py-2 text-black" required />
                </div>
                <div>
                  <label className="block mb-2 text-black">Porciones</label>
                  <input type="number" value={formData.servings} onChange={e => setFormData({...formData, servings: parseInt(e.target.value)})} className="w-full border rounded px-3 py-2 text-black" required />
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-black font-bold">Ingredientes</label>
                {formData.recipeIngredients.map(ri => (
                  <div key={ri.id} className="flex gap-2 mb-2">
                    <select value={ri.ingredient} onChange={e => updateIngredientField(ri.id, "ingredient", e.target.value)} className="flex-1 border rounded px-3 py-2 text-black" required>
                      <option value="">Seleccionar</option>
                      {ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name}</option>)}
                    </select>
                    <input type="number" step="0.01" value={ri.quantity} onChange={e => updateIngredientField(ri.id, "quantity", parseFloat(e.target.value))} className="w-24 border rounded px-3 py-2 text-black" placeholder="Cant." required />
                    <input type="text" value={ri.notes || ""} onChange={e => updateIngredientField(ri.id, "notes", e.target.value)} className="flex-1 border rounded px-3 py-2 text-black" placeholder="Notas" />
                    <button type="button" onClick={() => removeIngredient(ri.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">X</button>
                  </div>
                ))}
                <button type="button" onClick={addIngredient} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Agregar Ingrediente</button>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-black font-bold">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)} className={`px-3 py-1 rounded ${formData.tags.includes(tag.id) ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}>
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar</button>
                <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
