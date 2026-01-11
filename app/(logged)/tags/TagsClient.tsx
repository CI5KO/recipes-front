"use client";

import { useState, useEffect } from "react";
import { Tag } from "@/src/types";
import { storageUtils } from "@/src/lib/storage";
import { createTag, updateTag, deleteTag } from "@/src/services/tags.service";
import Modal from "@/src/components/atoms/Modal";
import Input from "@/src/components/atoms/Input";
import ColorPicker from "@/src/components/atoms/ColorPicker";
import TagCard from "@/src/components/molecules/TagCard";
import { MdLocalOffer } from "react-icons/md";

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
    closeModal();
  };

  const closeModal = () => {
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
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bg-complementary dark:bg-complementary-dark rounded-full p-4 border border-black bottom-4 right-4 cursor-pointer"
      >
        <MdLocalOffer className="text-2xl text-black" />
      </button>
      <h1 className="text-3xl font-bold pb-4">Tags</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map(tag => (
          <TagCard
            key={tag.id}
            tag={tag}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-xl font-semibold">
            {editingTag ? "Editar" : "Crear"} Tag
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <Input
              placeholder="Nombre"
              type="text"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
            />
            <Input
              placeholder="Tipo"
              type="text"
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value })}
            />
            <ColorPicker
              value={formData.color}
              onChange={(value) => setFormData({ ...formData, color: value })}
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
