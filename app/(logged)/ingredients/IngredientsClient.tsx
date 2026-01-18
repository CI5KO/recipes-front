"use client";

import { useState, useEffect } from "react";
import { Ingredient } from "@/src/types";
import { storageUtils } from "@/src/lib/storage";
import {
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "@/src/services/ingredient.service";

import Input from "@/src/components/atoms/Input";
import Select from "@/src/components/atoms/Select";
import Modal from "@/src/components/atoms/Modal";
import IngredientCard from "@/src/components/molecules/IngredientCard";

import { GiCookingPot } from "react-icons/gi";

export default function IngredientsClient() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    unitOfMeasure: "",
    pricePerUnit: 0,
  });

  useEffect(() => {
    setIngredients(storageUtils.getIngredients());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIngredient) {
      const updated = await updateIngredient(editingIngredient.id, formData);
      if (updated) {
        const newIngredients = ingredients.map((i) =>
          i.id === editingIngredient.id ? updated : i,
        );
        setIngredients(newIngredients);
        storageUtils.setIngredients(newIngredients);
      }
    } else {
      const newIngredient = await createIngredient(formData);
      const newIngredients = [...ingredients, newIngredient];
      setIngredients(newIngredients);
      storageUtils.setIngredients(newIngredients);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", unitOfMeasure: "", pricePerUnit: 0 });
    setEditingIngredient(null);
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      unitOfMeasure: ingredient.unitOfMeasure,
      pricePerUnit: ingredient.pricePerUnit,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteIngredient(id);
    const newIngredients = ingredients.filter((i) => i.id !== id);
    setIngredients(newIngredients);
    storageUtils.setIngredients(newIngredients);
  };

  return (
    <div className="p-6">
      <button
        onClick={() => setIsModalOpen(true)}
        className={`${
          ingredients.length === 0 && "animate-pulse"
        } fixed bg-complementary dark:bg-complementary-dark rounded-full p-4 border border-black bottom-4 right-4 cursor-pointer`}
      >
        <GiCookingPot className="text-2xl text-black" />
      </button>
      <h1 className="text-3xl font-bold pb-4">Ingredientes</h1>

      {ingredients.length === 0 ? (
        <p className="text-justify mt-8">
          No hay ingredientes disponibles. Para agregar un nuevo ingrediente,
          haz clic en el ícono en la parte inferior derecha.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients.map((ingredient) => (
            <IngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-xl font-semibold">
            {editingIngredient ? "Editar" : "Crear"} Ingrediente
          </h2>
          <form
            onSubmit={handleSubmit}
            className="max-h-[70vh] overflow-y-auto space-y-6 pt-4"
          >
            <Input
              placeholder="Nombre"
              type="text"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
            />
            <Select
              placeholder="Unidad de Medida"
              value={formData.unitOfMeasure}
              onChange={(value) =>
                setFormData({ ...formData, unitOfMeasure: value })
              }
              options={[
                { value: "Kilogramo", label: "Kilogramo" },
                { value: "Gramos", label: "Gramos" },
                { value: "Litros", label: "Litros" },
                { value: "Mililitros", label: "Mililitros" },
                { value: "Unidades", label: "Unidades" },
                { value: "Cucharadas", label: "Cucharadas" },
                { value: "Cucharaditas", label: "Cucharaditas" },
                { value: "Tazas", label: "Tazas" },
                { value: "Pizca", label: "Pizca" },
                { value: "Onzas", label: "Onzas" },
                { value: "Libras", label: "Libras" },
              ]}
            />
            <Input
              placeholder="Precio por Unidad"
              type="number"
              value={formData.pricePerUnit.toString()}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  pricePerUnit: parseFloat(value) || 0,
                })
              }
            />
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
