import React, { useState } from 'react';
import MobileChatWindow from './MobileChatWindow';
import './ChatConfigurator.css'; 
import { FaTrashAlt } from 'react-icons/fa'; 

const ChatConfigurator = () => {
    const [messages, setMessages] = useState([]);
    const [chatHeaderName, setChatHeaderName] = useState('Cuộc trò chuyện');
    const [newMessage, setNewMessage] = useState({
        content: '',
        senderName: 'Khách hàng',
        position: 'left',         
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!newMessage.content.trim()) return; 

        const lastMessage = messages[messages.length - 1];
        const currentPosition = newMessage.position;
        const currentSenderNameInput = newMessage.senderName.trim();

        let finalSenderName;
        
        if (!lastMessage || lastMessage.sender.position !== currentPosition) {
            finalSenderName = currentSenderNameInput || (currentPosition === 'left' ? 'Người Trái' : 'Tôi');
        } else {
            finalSenderName = lastMessage.sender.name;
        }

        if (currentPosition === 'left' && finalSenderName.trim()) {
             setChatHeaderName(finalSenderName);
        }

        const position = newMessage.position;

        const senderId = (position === 'left' ? 1 : 2);
        
        const now = new Date();
        const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const messageToAdd = {
            type: 'text',
            content: newMessage.content.trim(),
            time: timeString,
            
            sender: {
                id: senderId,
                name: finalSenderName,
                position: position, 
            }
        };

        setMessages(prevMessages => [...prevMessages, messageToAdd]);
        setNewMessage(prevMsg => ({ ...prevMsg, content: '' }));
    };

    const handleClearMessages = () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa hết tin nhắn?")) {
             setMessages([]);
        }
    };
    
    const hasMessages = messages.length > 0;
    const defaultChatPartnerName = messages.length > 0 && messages[messages.length - 1].sender.position === 'left'
        ? messages[messages.length - 1].sender.name
        : 'Cuộc trò chuyện';

    const dummyParticipantsConfig = {
        personA: { name: 'Người Trái' },
        personB: { name: 'Người Phải' }
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
                            onChange={(e) => setNewMessage({...newMessage, senderName: e.target.value})}
                        />
                    </div>
                    <div className="input-group">
                        <label>Vị trí tin nhắn:</label>
                        <select 
                            name="position" 
                            value={newMessage.position} 
                            onChange={(e) => setNewMessage({...newMessage, position: e.target.value})}
                        >
                            <option value="left">Bên Trái</option>
                            <option value="right">Bên Phải</option>
                        </select>
                    </div>
                    <div className="textarea-container">
                        <textarea
                            name="content"
                            placeholder="Nội dung tin nhắn..."
                            value={newMessage.content}
                            onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                            rows="4"
                            required
                        />
                        <button type="submit" className="add-message-btn">
                            Thêm Tin nhắn
                        </button>
                    </div>
                </form>
                
                <hr className="config-divider" />
                <button 
                    onClick={handleClearMessages} 
                    className="clear-message-btn" 
                    disabled={!hasMessages}
                >
                    <FaTrashAlt style={{ marginRight: '8px' }} /> Xóa Hết Tin Nhắn
                </button>

                {!hasMessages && (
                    <p className="no-chat-message">
                        Hãy thêm tin nhắn đầu tiên để hiển thị giao diện chat.
                    </p>
                )}
            </div>
                <MobileChatWindow 
                    messageData={messages} 
                    chatPartnerName={defaultChatPartnerName} 
                    groupParticipants={dummyParticipantsConfig} 
                />
        </div>  
    );
};

export default ChatConfigurator;