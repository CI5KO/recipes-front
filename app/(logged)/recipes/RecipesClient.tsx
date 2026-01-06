"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Recipe, RecipeIngredient, Ingredient, Tag } from "@/src/types";
import { storageUtils } from "@/src/lib/storage";
import {
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "@/src/services/recipes.service";

import Input from "@/src/components/atoms/Input";
import Button from "@/src/components/atoms/Button";
import TextArea from "@/src/components/atoms/TextArea";
import Modal from "@/src/components/atoms/Modal";
import Select from "@/src/components/atoms/Select";
import RecipeCard from "@/src/components/molecules/RecipeCard";

import { MdAdd, MdDelete } from "react-icons/md";
import { PiBowlFood } from "react-icons/pi";

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
    tags: [] as string[],
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
        const newRecipes = recipes.map((r) =>
          r.id === editingRecipe.id ? updated : r
        );
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
      tags: [],
    });
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormData(recipe);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteRecipe(id);
    const newRecipes = recipes.filter((r) => r.id !== id);
    setRecipes(newRecipes);
    storageUtils.setRecipes(newRecipes);
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      recipeIngredients: [
        ...formData.recipeIngredients,
        { id: crypto.randomUUID(), ingredient: "", quantity: 0, notes: "" },
      ],
    });
  };

  const removeIngredient = (id: string) => {
    setFormData({
      ...formData,
      recipeIngredients: formData.recipeIngredients.filter(
        (ri) => ri.id !== id
      ),
    });
  };

  const updateIngredientField = (
    id: string,
    field: keyof RecipeIngredient,
    value: any
  ) => {
    setFormData({
      ...formData,
      recipeIngredients: formData.recipeIngredients.map((ri) =>
        ri.id === id ? { ...ri, [field]: value } : ri
      ),
    });
  };

  const toggleTag = (tagId: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.includes(tagId)
        ? formData.tags.filter((t) => t !== tagId)
        : [...formData.tags, tagId],
    });
  };

  const getIngredientName = (id: string) =>
    ingredients.find((i) => i.id === id)?.name || "Desconocido";
  const getTagName = (id: string) =>
    tags.find((t) => t.id === id)?.name || "Desconocido";

  return (
    <div className="p-6">
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bg-complementary dark:bg-complementary-dark rounded-full p-4 border border-black bottom-4 right-4 cursor-pointer"
      >
        <PiBowlFood className="text-2xl text-black" />
      </button>
      <h1 className="text-3xl font-bold pb-4">Recetas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClick={(id) => router.push(`/recipes/${id}`)}
            getIngredientName={getIngredientName}
            getTagName={getTagName}
          />
        ))}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-xl font-semibold">
            {editingRecipe ? "Editar" : "Crear"} Receta
          </h2>
          <form
            onSubmit={handleSubmit}
            className="max-h-[70vh] overflow-y-auto space-y-4 pt-4"
          >
            <Input
              placeholder="Nombre"
              type="text"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
            />
            <TextArea
              placeholder="Descripción"
              value={formData.description}
              onChange={(value) =>
                setFormData({ ...formData, description: value })
              }
            />
            <TextArea
              placeholder="Instrucciones"
              value={formData.instructions}
              onChange={(value) =>
                setFormData({ ...formData, instructions: value })
              }
            />
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Tiempo (min)"
                type="number"
                value={formData.preparationTime.toString()}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    preparationTime: parseInt(value),
                  })
                }
              />
              <Select
                placeholder="Dificultad"
                value={formData.difficulty}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    difficulty: value,
                  })
                }
                options={[
                  { value: "Facil", label: "Facil" },
                  { value: "Intermedio", label: "Intermedio" },
                  { value: "Dificil", label: "Dificil" },
                ]}
              />
              <Input
                placeholder="Porciones"
                type="number"
                value={formData.servings.toString()}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    servings: parseInt(value),
                  })
                }
              />
            </div>
            <div className="flex flex-row w-full justify-center items-center">
              <label className="block font-semibold mr-2">
                Ingredientes ({formData.recipeIngredients.length})
              </label>
              <Button type="button" onClick={addIngredient}>
                <MdAdd />
              </Button>
            </div>
            {formData.recipeIngredients.map((ri) => (
              <div key={ri.id} className="flex flex-col md:flex-row gap-2 mb-4">
                <div className="flex gap-2 w-fit">
                  <Select
                    placeholder="Ingrediente"
                    value={ri.ingredient}
                    onChange={(value) =>
                      updateIngredientField(ri.id, "ingredient", value)
                    }
                    options={ingredients.map((ing) => ({
                      value: ing.id,
                      label: ing.name,
                    }))}
                  />
                  <Input
                    placeholder="Cantidad"
                    type="number"
                    value={ri.quantity.toString()}
                    onChange={(value) =>
                      updateIngredientField(
                        ri.id,
                        "quantity",
                        parseFloat(value)
                      )
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Notas"
                    type="text"
                    value={ri.notes || ""}
                    onChange={(value) =>
                      updateIngredientField(ri.id, "notes", value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(ri.id)}
                    className="bg-red-600 text-white justify-items-center px-3 py-1 rounded hover:bg-red-700 w-1/5"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))}
            <label className="block mb-2 font-semibold">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 rounded ${
                    formData.tags.includes(tag.id)
                      ? "bg-complementary dark:bg-complementary-dark text-white"
                      : "bg-gray-200 dark:bg-gray-800"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2 w-full">
              <button
                type="submit"
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700 w-full"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
