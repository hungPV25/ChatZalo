import React, { useState } from "react";
import MobileChatWindow from "./MobileChatWindow";
import "./ChatConfigurator.css";
import { FaTrashAlt } from "react-icons/fa";
import { AVAILABLE_ICONS } from "../assets/index.jsx";

const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const ChatConfigurator = () => {
  const [messages, setMessages] = useState([]);
  const [chatHeaderName, setChatHeaderName] = useState("Cuộc trò chuyện");
  const [selectedStickerPreview, setSelectedStickerPreview] = useState(null);
  const [contentType, setContentType] = useState("text");
  const [newMessage, setNewMessage] = useState({
    content: "",
    senderName: "",
    position: "left",
    time: "",
    imageSrc: null,
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        setNewMessage((prevMsg) => ({ ...prevMsg, imageSrc: dataUrl }));
      } catch (error) {
        console.error("Lỗi đọc file:", error);
        setNewMessage((prevMsg) => ({ ...prevMsg, imageSrc: null }));
      }
    } else {
      setNewMessage((prevMsg) => ({ ...prevMsg, imageSrc: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      contentType === "text" &&
      !newMessage.content.trim() &&
      !newMessage.imageSrc
    ) {
      return;
    }

    if (contentType === "sticker" && !selectedStickerPreview) {
      alert("Vui lòng chọn một Sticker.");
      return;
    }

    const lastMessage = messages[messages.length - 1];
    const currentPosition = newMessage.position;
    const currentSenderNameInput = newMessage.senderName.trim();

    let finalSenderName;

    if (!lastMessage || lastMessage.sender.position !== currentPosition) {
      finalSenderName =
        currentSenderNameInput ||
        (currentPosition === "left" ? "Người Trái" : "Tôi");
    } else {
      finalSenderName = lastMessage.sender.name;
    }

    if (currentPosition === "left" && finalSenderName.trim()) {
      setChatHeaderName(finalSenderName);
    }

    const position = newMessage.position;
    const senderId = position === "left" ? 1 : 2;
    const timeString = newMessage.time.trim();

    const messageToAdd = {
      type: "text",
      content: newMessage.content.trim(),
      time: timeString,
      imageSrc: newMessage.imageSrc,
      sender: {
        id: senderId,
        name: finalSenderName,
        position: position,
      },
    };

    setMessages((prevMessages) => [...prevMessages, messageToAdd]);
    setNewMessage((prevMsg) => ({ ...prevMsg, content: "" }));

    setNewMessage(() => ({
      content: "",
      senderName: "",
      position: "left",
      time: "",
      imageSrc: null,
    }));
  };

  const handleClearMessages = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hết tin nhắn?")) {
      setMessages([]);
    }
  };

  const hasMessages = messages.length > 0;

  const handleIconSelect = (iconSrc, iconAlt) => {
    const iconHtml = `<img src="${iconSrc}" alt="${iconAlt}" class="message-sticker"/>`;
    setSelectedStickerPreview(iconSrc);
    setNewMessage((prevMsg) => ({
      ...prevMsg,
      content: iconHtml,
    }));
  };

  return (
    <div className="chat-config-container">
      <div className="config-panel">
        <h3>Cấu hình Tin nhắn Nhanh 🚀</h3>
        <h3>Thêm Tin nhắn</h3>
        <form onSubmit={handleSubmit} className="message-form simple-form">
          <div className="input-group">
            <label>Tên người gửi:</label>
            <input
              type="text"
              placeholder="Nhập tên người gửi"
              value={newMessage.senderName}
              onChange={(e) =>
                setNewMessage({ ...newMessage, senderName: e.target.value })
              }
            />
          </div>
          <div className="input-group">
            <label>Vị trí tin nhắn:</label>
            <select
              name="position"
              value={newMessage.position}
              onChange={(e) =>
                setNewMessage({ ...newMessage, position: e.target.value })
              }
            >
              <option value="left">Bên Trái</option>
              <option value="right">Bên Phải</option>
            </select>
          </div>
          <div className="input-group">
            <label>Thời gian (HH:MM):</label>
            <input
              type="text"
              placeholder="Nhập thời gian gửi"
              value={newMessage.time}
              onChange={(e) =>
                setNewMessage({ ...newMessage, time: e.target.value })
              }
            />
          </div>
          <div className="input-group">
            <label>Chọn Ảnh:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              key={newMessage.imageSrc || "no-file"}
            />
            {newMessage.imageSrc && (
              <img
                src={newMessage.imageSrc}
                alt="Preview"
                className="preview-img"
              />
            )}
          </div>
          <div className="input-group">
            <label>Loại Nội dung tin nhắn:</label>
            <select
              value={contentType}
              onChange={(e) => {
                const newType = e.target.value;
                setContentType(newType);
                setNewMessage({ ...newMessage, content: "" });
              }}
            >
              <option value="text">Tin nhắn Văn bản</option>
              <option value="sticker">Sticker/Icon</option>
            </select>
          </div>
          <div className="input-group">
            {contentType === "text" && (
              <textarea
                name="content"
                placeholder="Nhập nội dung tin nhắn..."
                value={newMessage.content}
                onChange={(e) =>
                  setNewMessage({ ...newMessage, content: e.target.value })
                }
                rows="4"
                required={!newMessage.imageSrc}
                className="content-textarea"
              />
            )}

            {contentType === "sticker" && (
              <div className="sticker-selector-container">
                <p>Chọn một Sticker:</p>
                {selectedStickerPreview && (
                  <img
                    src={selectedStickerPreview}
                    alt="Selected Sticker Preview"
                    className="selected-sticker-preview-image"
                  />
                )}
                <div className="icon-selection-bar">
                  {AVAILABLE_ICONS.map((icon, index) => (
                    <img
                      key={index}
                      src={icon.src}
                      alt={icon.alt}
                      className={`selectable-image-icon ${
                        newMessage.content.includes(icon.src)
                          ? "selected-icon"
                          : ""
                      }`}
                      onClick={() => handleIconSelect(icon.src, icon.alt)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <button type="submit" className="add-message-btn">
            Thêm Tin nhắn
          </button>
        </form>

        <hr className="config-divider" />
        <button
          onClick={handleClearMessages}
          className="clear-message-btn"
          disabled={!hasMessages}
        >
          <FaTrashAlt style={{ marginRight: "8px" }} /> Xóa Hết Tin Nhắn
        </button>

        {!hasMessages && (
          <p className="no-chat-message">
            Hãy thêm tin nhắn đầu tiên để hiển thị giao diện chat.
          </p>
        )}
      </div>
      <MobileChatWindow
        messageData={messages}
        chatPartnerName={chatHeaderName}
      />
    </div>
  );
};

export default ChatConfigurator;
