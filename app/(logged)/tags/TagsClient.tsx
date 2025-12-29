"use client";

import { useState, useEffect } from "react";
import { Tag } from "@/src/types";
import { storageUtils } from "@/src/lib/storage";
import { createTag, updateTag, deleteTag } from "@/src/services/tags.service";

export default function TagsClient() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({ name: "", type: "", color: "#000000" });

  useEffect(() => {
    setTags(storageUtils.getTags());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTag) {
      const updated = await updateTag(editingTag.id, formData);
      if (updated) {
        const newTags = tags.map(t => t.id === editingTag.id ? updated : t);
        setTags(newTags);
        storageUtils.setTags(newTags);
      }
    } else {
      const newTag = await createTag(formData);
      const newTags = [...tags, newTag];
      setTags(newTags);
      storageUtils.setTags(newTags);
    }
    setIsModalOpen(false);
    setFormData({ name: "", type: "", color: "#000000" });
    setEditingTag(null);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({ name: tag.name, type: tag.type, color: tag.color });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteTag(id);
    const newTags = tags.filter(t => t.id !== id);
    setTags(newTags);
    storageUtils.setTags(newTags);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tags</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Crear Tag</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map(tag => (
          <div key={tag.id} className="border rounded-lg p-4 shadow">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: tag.color }}></div>
              <h3 className="font-bold text-lg">{tag.name}</h3>
            </div>
            <p className="text-gray-600 mb-4">Tipo: {tag.type}</p>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(tag)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Editar</button>
              <button onClick={() => handleDelete(tag.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingTag ? "Editar Tag" : "Crear Tag"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-black">Nombre</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded px-3 py-2 text-black" required />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-black">Tipo</label>
                <input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border rounded px-3 py-2 text-black" required />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-black">Color</label>
                <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar</button>
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingTag(null); setFormData({ name: "", type: "", color: "#000000" }); }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
