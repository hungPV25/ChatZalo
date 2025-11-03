import React, { useState } from "react";
import {
  FaChevronLeft,
  FaPhoneAlt,
  FaVideo,
  FaEllipsisV,
  FaRegSmile,
  FaMicrophoneAlt,
  FaRegImage,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import "./MobileChatWindow.css";

const MobileBubble = ({ msg }) => {
  const { type, content, time, sender, imageSrc, reactionCount } = msg;

  const [isLiked, setIsLiked] = useState(false);

  if (type === "system") {
    return <div className="mobile-system-message">{content}</div>;
  }

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  const showReactionBubble = isLiked || reactionCount > 0;
  const displayCount = reactionCount + (isLiked ? 1 : 0);
  const { position } = sender;
  const isMine = position === "right";
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
          <span
            className="mobile-message-text"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {hasTime && (
            <span className={`mobile-message-time-in-bubble ${position}`}>
              {time}
            </span>
          )}
          {showReactionBubble && (
            <div className={`zalo-like-button-count ${isLiked ? "liked" : ""}`}>
              <FaHeart size={12} className="zalo-heart-icon filled-heart" />
              <span className="zalo-like-count">{displayCount}</span>
            </div>
          )}
          <div className={`zalo-like-button ${isLiked ? "liked" : ""}`}>
            <FaHeart size={14} className="zalo-heart-icon filled-heart" />
          </div>
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
        <FaRegSmile size={24} className="input-footer-icon" />
        <div className="mobile-input-container">
          <input
            type="text"
            placeholder="Tin nhắn"
            className="mobile-text-input"
          />
        </div>
        <BsThreeDots size={24} className="input-footer-icon" />
        <FaMicrophoneAlt size={24} className="input-footer-icon" />
        <FaRegImage size={24} className="input-footer-icon blue-icon" />
      </div>
    </div>
  );
};

export default MobileChatWindow;
