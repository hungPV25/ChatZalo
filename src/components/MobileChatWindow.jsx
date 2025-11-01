import React from "react";
import { FaChevronLeft, FaPhoneAlt, FaVideo, FaEllipsisV, FaRegSmile } from "react-icons/fa";
import { BsPlusCircle } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import AvatarPlaceholder from './AvatarPlaceholder'; 
import "./MobileChatWindow.css"; 

const MobileBubble = ({ type, content, position, time, avatarId, participantInfo, isFirstInGroup }) => { 
  if (type === 'system') {
    return <div className="mobile-system-message">{content}</div>;
  }
  
  const isMine = position === "right";
  const participantData = participantInfo || {}; 
  const senderKey = isMine ? 'personB' : 'personA';
  const safeAvatarId = participantData[senderKey] ? participantData[senderKey].avatarId : avatarId;

  return (
    <div className={`mobile-message-row ${position} ${isFirstInGroup ? 'group-start' : ''}`}> {/* Thêm class group-start */}
      {!isMine && isFirstInGroup && (
        <AvatarPlaceholder 
            size={30} 
            className="mobile-message-avatar" 
            id={safeAvatarId} 
        /> 
      )}
      {!isMine && !isFirstInGroup && (
          <div style={{ width: 30, height: 30, marginRight: 5 }} className="mobile-message-avatar-spacer" />
      )}

      <div className="mobile-bubble-content">
        <div className={`mobile-message-bubble ${position} ${isFirstInGroup ? 'first-in-group' : 'in-group'}`}>
          <span className="mobile-message-text">{content}</span>
        </div>
        <span className={`mobile-message-time ${position}`}>{time}</span>
      </div>
    </div>
  );
};

const MobileChatWindow = ({ messageData, chatPartnerName, participantsConfig }) => {
  const chatPartnerStatus = "Truy cập 39 phút trước";
  
  const processedMessages = messageData.map((msg, index) => {
    const previousMsg = messageData[index - 1];
    const isSameSender = previousMsg && previousMsg.position === msg.position && previousMsg.type === 'text';
    const isFirstInGroup = !isSameSender || !previousMsg;
    
    return {
        ...msg,
        isFirstInGroup,
        participantInfo: participantsConfig 
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
        {processedMessages.map((msg, index) => (
          <MobileBubble key={index} {...msg} />
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