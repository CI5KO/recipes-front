"use client";

import { useState, useEffect, useRef } from "react";
import { storageUtils } from "@/src/lib/storage";
import type { Recipe, Ingredient, Tag } from "@/src/types";
import {
  MdFileDownload,
  MdFileUpload,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdQrCode2,
  MdQrCodeScanner,
} from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { Html5Qrcode } from "html5-qrcode";

export default function DataTransferClient() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [selectedRecipes, setSelectedRecipes] = useState<Set<string>>(
    new Set()
  );
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(
    new Set()
  );
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [showQrScanner, setShowQrScanner] = useState<boolean>(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRecipes(storageUtils.getRecipes());
    setIngredients(storageUtils.getIngredients());
    setTags(storageUtils.getTags());
  };

  const toggleSelection = (
    id: string,
    set: Set<string>,
    setter: (s: Set<string>) => void
  ) => {
    const newSet = new Set(set);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setter(newSet);
  };

  const toggleRecipeWithDependencies = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    const newRecipes = new Set(selectedRecipes);
    const newIngredients = new Set(selectedIngredients);
    const newTags = new Set(selectedTags);

    if (newRecipes.has(recipeId)) {
      newRecipes.delete(recipeId);
    } else {
      newRecipes.add(recipeId);
      recipe.recipeIngredients.forEach((ri) =>
        newIngredients.add(ri.ingredient)
      );
      recipe.tags.forEach((tagId) => newTags.add(tagId));
    }

    setSelectedRecipes(newRecipes);
    setSelectedIngredients(newIngredients);
    setSelectedTags(newTags);
  };

  const selectAll = (ids: string[], setter: (s: Set<string>) => void) => {
    setter(new Set(ids));
  };

  const deselectAll = (setter: (s: Set<string>) => void) => {
    setter(new Set());
  };

  const exportData = () => {
    const data = {
      recipes: recipes.filter((r) => selectedRecipes.has(r.id)),
      ingredients: ingredients.filter((i) => selectedIngredients.has(i.id)),
      tags: tags.filter((t) => selectedTags.has(t.id)),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recipes-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification("Datos exportados exitosamente");
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);

        const currentRecipes = storageUtils.getRecipes();
        const currentIngredients = storageUtils.getIngredients();
        const currentTags = storageUtils.getTags();

        const mergedRecipes = [...currentRecipes, ...(imported.recipes || [])];
        const mergedIngredients = [
          ...currentIngredients,
          ...(imported.ingredients || []),
        ];
        const mergedTags = [...currentTags, ...(imported.tags || [])];

        storageUtils.setRecipes(mergedRecipes);
        storageUtils.setIngredients(mergedIngredients);
        storageUtils.setTags(mergedTags);

        loadData();
        showNotification(
          `Importados: ${imported.recipes?.length || 0} recetas, ${
            imported.ingredients?.length || 0
          } ingredientes, ${imported.tags?.length || 0} tags`
        );
      } catch (error) {
        showNotification("Error al importar archivo");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const generateQR = async () => {
    const data = {
      recipes: recipes.filter((r) => selectedRecipes.has(r.id)),
      ingredients: ingredients.filter((i) => selectedIngredients.has(i.id)),
      tags: tags.filter((t) => selectedTags.has(t.id)),
      exportDate: new Date().toISOString(),
    };

    try {
      const qrUrl = await QRCode.toDataURL(JSON.stringify(data), {
        width: 400,
      });
      setQrCodeUrl(qrUrl);
      showNotification("Código QR generado exitosamente");
    } catch (error) {
      showNotification("Error al generar código QR");
    }
  };

  const startQrScanner = async () => {
    setShowQrScanner(true);
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
          await scanner.start(
            cameras[0].id,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              stopQrScanner();
              processQrData(decodedText);
            },
            () => {}
          );
        } else {
          showNotification("No se encontró ninguna cámara");
          setShowQrScanner(false);
        }
      } catch (error) {
        console.error("Error al iniciar escáner:", error);
        showNotification("Error al acceder a la cámara. Verifica los permisos.");
        setShowQrScanner(false);
      }
    }, 100);
  };

  const stopQrScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current?.clear();
        scannerRef.current = null;
        setShowQrScanner(false);
      }).catch((err) => {
        console.error("Error al detener escáner:", err);
        setShowQrScanner(false);
      });
    }
  };

  const processQrData = (data: string) => {
    try {
      const imported = JSON.parse(data);

      const currentRecipes = storageUtils.getRecipes();
      const currentIngredients = storageUtils.getIngredients();
      const currentTags = storageUtils.getTags();

      const mergedRecipes = [...currentRecipes, ...(imported.recipes || [])];
      const mergedIngredients = [
        ...currentIngredients,
        ...(imported.ingredients || []),
      ];
      const mergedTags = [...currentTags, ...(imported.tags || [])];

      storageUtils.setRecipes(mergedRecipes);
      storageUtils.setIngredients(mergedIngredients);
      storageUtils.setTags(mergedTags);

      loadData();
      showNotification(
        `Importados: ${imported.recipes?.length || 0} recetas, ${
          imported.ingredients?.length || 0
        } ingredientes, ${imported.tags?.length || 0} tags`
      );
    } catch (error) {
      showNotification("Error al procesar código QR");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={() => router.push("/home")}
        className="flex items-center gap-2 mb-6 text-pink-500 hover:text-pink-700 font-semibold transition"
      >
        <IoArrowBack /> Volver
      </button>

      <h1 className="text-3xl font-bold mb-6">Importar / Exportar Datos</h1>

      {notification && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-500 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-6">
          {notification}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <button
            onClick={exportData}
            disabled={
              selectedRecipes.size === 0 &&
              selectedIngredients.size === 0 &&
              selectedTags.size === 0
            }
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <MdFileDownload size={24} /> Exportar Archivo
          </button>
          <button
            onClick={generateQR}
            disabled={
              selectedRecipes.size === 0 &&
              selectedIngredients.size === 0 &&
              selectedTags.size === 0
            }
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <MdQrCode2 size={24} /> Generar QR
          </button>
        </div>
        <div className="space-y-2">
          <label className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition cursor-pointer">
            <MdFileUpload size={24} /> Importar Archivo
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
          <button
            onClick={startQrScanner}
            className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <MdQrCodeScanner size={24} /> Escanear QR
          </button>
        </div>
      </div>

      {qrCodeUrl && (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow mb-6 text-center">
          <h2 className="text-xl font-bold mb-4">Código QR Generado</h2>
          <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-4" />
          <button
            onClick={() => setQrCodeUrl("")}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Cerrar
          </button>
        </div>
      )}

      {showQrScanner && (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow mb-6">
          <h2 className="text-xl font-bold mb-4 text-center">
            Escanear Código QR
          </h2>
          <div id="qr-reader" className="mb-4"></div>
          <button
            onClick={stopQrScanner}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Cancelar
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recetas ({recipes.length})</h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  selectAll(
                    recipes.map((r) => r.id),
                    setSelectedRecipes
                  )
                }
                className="text-xs text-blue-600 hover:underline"
              >
                Todos
              </button>
              <button
                onClick={() => deselectAll(setSelectedRecipes)}
                className="text-xs text-gray-600 hover:underline"
              >
                Ninguno
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => toggleRecipeWithDependencies(recipe.id)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
              >
                {selectedRecipes.has(recipe.id) ? (
                  <MdCheckBox className="text-blue-600" size={20} />
                ) : (
                  <MdCheckBoxOutlineBlank size={20} />
                )}
                <span className="text-sm">{recipe.name}</span>
              </div>
            ))}
            {recipes.length === 0 && (
              <p className="text-gray-500 text-sm">No hay recetas</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Ingredientes ({ingredients.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  selectAll(
                    ingredients.map((i) => i.id),
                    setSelectedIngredients
                  )
                }
                className="text-xs text-blue-600 hover:underline"
              >
                Todos
              </button>
              <button
                onClick={() => deselectAll(setSelectedIngredients)}
                className="text-xs text-gray-600 hover:underline"
              >
                Ninguno
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                onClick={() =>
                  toggleSelection(
                    ingredient.id,
                    selectedIngredients,
                    setSelectedIngredients
                  )
                }
                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
              >
                {selectedIngredients.has(ingredient.id) ? (
                  <MdCheckBox className="text-blue-600" size={20} />
                ) : (
                  <MdCheckBoxOutlineBlank size={20} />
                )}
                <span className="text-sm">{ingredient.name}</span>
              </div>
            ))}
            {ingredients.length === 0 && (
              <p className="text-gray-500 text-sm">No hay ingredientes</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tags ({tags.length})</h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  selectAll(
                    tags.map((t) => t.id),
                    setSelectedTags
                  )
                }
                className="text-xs text-blue-600 hover:underline"
              >
                Todos
              </button>
              <button
                onClick={() => deselectAll(setSelectedTags)}
                className="text-xs text-gray-600 hover:underline"
              >
                Ninguno
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tags.map((tag) => (
              <div
                key={tag.id}
                onClick={() =>
                  toggleSelection(tag.id, selectedTags, setSelectedTags)
                }
                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
              >
                {selectedTags.has(tag.id) ? (
                  <MdCheckBox className="text-blue-600" size={20} />
                ) : (
                  <MdCheckBoxOutlineBlank size={20} />
                )}
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  ></div>
                  <span className="text-sm">{tag.name}</span>
                </div>
              </div>
            ))}
            {tags.length === 0 && (
              <p className="text-gray-500 text-sm">No hay tags</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
