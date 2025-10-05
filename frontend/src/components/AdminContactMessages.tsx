"use client";

import { useState, useEffect } from "react";
import { authenticatedFetch, getApiBaseUrl } from "@/utils/api";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface AdminContactMessagesProps {
  onClose: () => void;
}

export default function AdminContactMessages({
  onClose,
}: AdminContactMessagesProps) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadContactMessages();
  }, []);

  const loadContactMessages = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/contact/messages`,
        {},
        token!
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error loading contact messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/contact/messages/${messageId}/read`,
        {
          method: "PATCH",
        },
        token!
      );

      if (response.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Энэ мэдээллийг устгахдаа итгэлтэй байна уу?")) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await authenticatedFetch(
        `${getApiBaseUrl()}/api/contact/messages/${messageId}`,
        {
          method: "DELETE",
        },
        token!
      );

      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const filteredMessages = messages.filter((message) => {
    const normalizedQuery = searchQuery.toLowerCase();
    return (
      message.name.toLowerCase().includes(normalizedQuery) ||
      message.email.toLowerCase().includes(normalizedQuery) ||
      message.phone.toLowerCase().includes(normalizedQuery) ||
      message.message.toLowerCase().includes(normalizedQuery)
    );
  });

  const unreadCount = messages.filter((msg) => !msg.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Ачаалж байна...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Холбоо барих мэдээллүүд
          </h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Нийт: {messages.length} | Уншаагүй: {unreadCount}
            </span>
            <button
              onClick={onClose}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Нэр, имэйл, утас, мессежээр хайх..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Мэдээллийн жагсаалт</h4>
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Мэдээлэл олдсонгүй
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.isRead) {
                        markAsRead(message.id);
                      }
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      message.isRead
                        ? "bg-gray-50 border-gray-200"
                        : "bg-blue-50 border-blue-200"
                    } ${
                      selectedMessage?.id === message.id
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {message.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {message.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(message.createdAt).toLocaleString("mn-MN")}
                        </div>
                      </div>
                      {!message.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="text-sm text-gray-700 mt-2 line-clamp-2">
                      {message.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">
              Мэдээллийн дэлгэрэнгүй
            </h4>
            {selectedMessage ? (
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      {selectedMessage.name}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {selectedMessage.email}
                    </p>
                    {selectedMessage.phone && (
                      <p className="text-sm text-gray-600">
                        {selectedMessage.phone}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {!selectedMessage.isRead && (
                      <button
                        onClick={() => markAsRead(selectedMessage.id)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Уншсан гэж тэмдэглэх
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Устгах
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Илгээсэн огноо
                  </label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedMessage.createdAt).toLocaleString(
                      "mn-MN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Мессеж
                  </label>
                  <div className="bg-white p-3 rounded border text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                Мэдээллийг сонгоно уу
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            Хаах
          </button>
        </div>
      </div>
    </div>
  );
}
