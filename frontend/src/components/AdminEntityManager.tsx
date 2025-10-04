"use client";

import { useState } from "react";
import { authenticatedFetch, getApiBaseUrl } from "@/utils/api";
import { Entity } from "@/types";
import ImageUpload from "@/components/ImageUpload";
import RichTextEditor from "@/components/RichTextEditor";

interface EntityManagerProps {
  type: string;
  entities: Entity[];
  title: string;
  onDelete: (type: string, id: string) => void;
  onUpdate: (type: string, entity: Entity) => void;
  onCreate?: (type: string, entity: Entity) => void;
}

export default function AdminEntityManager({
  type,
  entities,
  title,
  onDelete,
  onUpdate,
  onCreate,
}: EntityManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [formData, setFormData] = useState<Partial<Entity>>({});

  const handleAdd = () => {
    setEditingEntity(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (entity: Entity) => {
    setEditingEntity(entity);
    setFormData(entity);
    setShowModal(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    try {
      if (editingEntity) {
        // Update existing entity
        const response = await authenticatedFetch(
          `${getApiBaseUrl()}/api/${type}/${editingEntity.id}`,
          {
            method: "PUT",
            body: JSON.stringify(formData),
          },
          token!
        );

        if (response.ok) {
          onUpdate(type, { ...editingEntity, ...formData });
        }
      } else {
        // Create new entity
        const response = await authenticatedFetch(
          `${getApiBaseUrl()}/api/${type}`,
          {
            method: "POST",
            body: JSON.stringify(formData),
          },
          token!
        );

        if (response.ok) {
          const newEntity = await response.json();
          if (onCreate) {
            onCreate(type, newEntity);
          } else {
            onUpdate(type, newEntity);
          }
        }
      }

      setShowModal(false);
      setEditingEntity(null);
      setFormData({});
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev: Partial<Entity>) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Шинэ нэмэх
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {entities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Одоогоор {title.toLowerCase()} байхгүй байна.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {entities.map((entity) => (
                <div key={entity.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {entity.title || entity.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {entity.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(entity)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded"
                      >
                        Засах
                      </button>
                      <button
                        onClick={() => onDelete(type, entity.id)}
                        className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded"
                      >
                        Устгах
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingEntity ? "Засах" : "Шинэ нэмэх"}
              </h3>

              <div className="space-y-4">
                {type === "universities" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Нэр
                      </label>
                      <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Байршил
                      </label>
                      <input
                        type="text"
                        value={formData.location || ""}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Тайлбар
                      </label>
                      <RichTextEditor
                        value={formData.description || ""}
                        onChange={(value) =>
                          handleInputChange("description", value)
                        }
                        placeholder="Их сургуулийн дэлгэрэнгүй тайлбар..."
                        rows={4}
                      />
                    </div>
                    <ImageUpload
                      value={formData.imageUrl || ""}
                      onChange={(url) => handleInputChange("imageUrl", url)}
                      label="Их сургуулийн зураг"
                      placeholder="Их сургуулийн зургийн URL эсвэл файл сонгоно уу"
                    />
                  </>
                )}

                {type === "programs" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Гарчиг
                      </label>
                      <input
                        type="text"
                        value={formData.title || ""}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Тайлбар
                      </label>
                      <RichTextEditor
                        value={formData.description || ""}
                        onChange={(value) =>
                          handleInputChange("description", value)
                        }
                        placeholder="Хөтөлбөрийн дэлгэрэнгүй тайлбар..."
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Үргэлжлэх хугацаа
                      </label>
                      <input
                        type="text"
                        value={formData.duration || ""}
                        onChange={(e) =>
                          handleInputChange("duration", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Түвшин
                      </label>
                      <select
                        value={formData.level || ""}
                        onChange={(e) =>
                          handleInputChange("level", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                      >
                        <option value="">Сонгох</option>
                        <option value="Бакалавр">Бакалавр</option>
                        <option value="Магистр">Магистр</option>
                        <option value="Доктор">Доктор</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Google Form холбоос
                      </label>
                      <input
                        type="text"
                        value={formData.googleFormLink || ""}
                        onChange={(e) =>
                          handleInputChange("googleFormLink", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                      />
                    </div>
                    <ImageUpload
                      value={formData.imageUrl || ""}
                      onChange={(url) => handleInputChange("imageUrl", url)}
                      label="Хөтөлбөрийн зураг"
                      placeholder="Хөтөлбөрийн зургийн URL эсвэл файл сонгоно уу"
                    />
                  </>
                )}

                {type === "news" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Гарчиг
                      </label>
                      <input
                        type="text"
                        value={formData.title || ""}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Агуулга
                      </label>
                      <RichTextEditor
                        value={formData.content || ""}
                        onChange={(value) =>
                          handleInputChange("content", value)
                        }
                        placeholder="Мэдээний дэлгэрэнгүй агуулга..."
                        rows={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Зохиогч
                      </label>
                      <input
                        type="text"
                        value={formData.author || ""}
                        onChange={(e) =>
                          handleInputChange("author", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Нийтлэх огноо
                      </label>
                      <input
                        type="date"
                        value={formData.publishDate || ""}
                        onChange={(e) =>
                          handleInputChange("publishDate", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                      />
                    </div>
                    <ImageUpload
                      value={formData.imageUrl || ""}
                      onChange={(url) => handleInputChange("imageUrl", url)}
                      label="Мэдээний зураг"
                      placeholder="Мэдээний зургийн URL эсвэл файл сонгоно уу"
                    />
                  </>
                )}

                {type === "users" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Овог
                      </label>
                      <input
                        type="text"
                        value={formData.firstName || ""}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Нэр
                      </label>
                      <input
                        type="text"
                        value={formData.lastName || ""}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        И-мэйл
                      </label>
                      <input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Утасны дугаар
                      </label>
                      <input
                        type="text"
                        value={formData.phoneNumber || ""}
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Хэрэглэгчийн код
                      </label>
                      <input
                        type="text"
                        value={formData.userCode || ""}
                        onChange={(e) =>
                          handleInputChange("userCode", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Цуцлах
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  Хадгалах
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
