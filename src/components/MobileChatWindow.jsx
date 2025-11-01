import React from "react";
import {
  FaChevronLeft,
  FaPhoneAlt,
  FaVideo,
  FaEllipsisV,
  FaRegSmile,
} from "react-icons/fa";
import { BsPlusCircle } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import "./MobileChatWindow.css";

const MobileBubble = ({ msg, isFirstInGroup }) => {
  const { type, content, time, sender, imageSrc } = msg;

  if (type === "system") {
    return <div className="mobile-system-message">{content}</div>;
  }
  console.log(msg);

  const { position } = sender;
  const isMine = position === "right";
  const showAvatar = isFirstInGroup;
  const hasTime = !!time;
  const showImage = !isMine && !!imageSrc;
  return (
    <div className={`mobile-message-row ${position}`}>
      <div className="mobile-message-content">
        {showImage && (
          <div className="mobile-image-container">
            <img
              src={imageSrc}
              alt="Message attachment"
              className="mobile-message-image"
            />
          </div>
        )}
        <div
          className={`mobile-message-bubble ${position} ${
            !hasTime ? "no-time" : ""
          } ${!showImage ? "no-message-image" : ""}`}
        >
          <span className="mobile-message-text">{content}</span>
          {hasTime && (
            <span className={`mobile-message-time-in-bubble ${position}`}>
              {time}
            </span>
          )}
        </div>
      </div>
      {isMine && <div className="mobile-message-right-spacer"></div>}
    </div>
  );
};

const MobileChatWindow = ({ messageData, chatPartnerName }) => {
  const chatPartnerStatus = "Đang hoạt động";
  const processedMessages = messageData.map((msg, index, array) => {
    const prevMsg = array[index - 1];
    const currentSenderId = msg.sender.id;
    const prevSenderId = prevMsg ? prevMsg.sender.id : null;
    const isSameSender = prevMsg && prevSenderId === currentSenderId;
    const isFirstInGroup = !isSameSender;
    const showName = isFirstInGroup && msg.sender.position === "left";
    return {
      msg: msg,
      isFirstInGroup,
      showName,
    };
  });

  return (
    <div className="mobile-chat-window">
      <div className="mobile-header">
        <FaChevronLeft size={20} className="mobile-header-icon back-icon" />
        <div className="mobile-header-info">
          <div className="mobile-header-text">
            <span className="mobile-header-name">{chatPartnerName}</span>
            <span className="mobile-header-status">{chatPartnerStatus}</span>
          </div>
        </div>
        <div className="mobile-header-actions">
          <FaPhoneAlt size={20} className="mobile-header-icon" />
          <FaVideo size={20} className="mobile-header-icon" />
          <FaEllipsisV size={20} className="mobile-header-icon" />
        </div>
      </div>
      <div className="mobile-message-list">
        {processedMessages.map((item, index) => (
          <MobileBubble
            key={index}
            msg={item.msg}
            isFirstInGroup={item.isFirstInGroup}
            showName={item.showName}
          />
        ))}
      </div>
      <div className="mobile-input-footer">
        <BsPlusCircle size={24} className="input-footer-icon" />
        <div className="mobile-input-container">
          <input
            type="text"
            placeholder="Tin nhắn"
            className="mobile-text-input"
          />
          <FaRegSmile size={24} className="input-icon-inside" />
        </div>
        <IoSend size={24} className="input-footer-send-icon blue-icon" />
      </div>
    </div>
  );
};

export default MobileChatWindow;
