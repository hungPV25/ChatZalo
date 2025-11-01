import React, { useState } from 'react';
import MobileChatWindow from './MobileChatWindow';
import './ChatConfigurator.css'; 
import { FaTrashAlt } from 'react-icons/fa'; 

const createIdFromName = (name) => {
    if (!name || name.trim() === '') return 1;
    const hash = name.trim().toUpperCase().charCodeAt(0);
    return (hash % 10) + 1; 
};

const ChatConfigurator = () => {
    const [messages, setMessages] = useState([]);

    const initialPersonAName = '';
    const initialPersonBName = '';

    const [participantsConfig, setParticipantsConfig] = useState({
        personA: { 
            name: initialPersonAName, 
            avatarId: createIdFromName(initialPersonAName), 
            position: 'left' 
        },
        personB: { 
            name: initialPersonBName, 
            avatarId: createIdFromName(initialPersonBName), 
            position: 'right' 
        },
    });

    const [newMessage, setNewMessage] = useState({
        content: '',
        sendingParticipant: 'personA', 
    });

    const handleParticipantChange = (e, personKey) => {
        const { name, value } = e.target;
        const newAvatarId = createIdFromName(value); 
        setParticipantsConfig(prevConfig => ({
            ...prevConfig,
            [personKey]: {
                ...prevConfig[personKey],
                [name]: value,      
                avatarId: newAvatarId 
            },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!newMessage.content.trim()) return; 

        const senderKey = newMessage.sendingParticipant;
        const sender = participantsConfig[senderKey];

        const now = new Date();
        const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const messageToAdd = {
            type: 'text',
            content: newMessage.content.trim(),
            position: sender.position, 
            time: timeString,
            avatarId: sender.avatarId 
        };

        setMessages(prevMessages => [...prevMessages, messageToAdd]);
        setNewMessage({ ...newMessage, content: '' });
    };

    const handleClearMessages = () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa hết tin nhắn và bắt đầu lại?")) {
             setMessages([]);
        }
    };
    
    const hasMessages = messages.length > 0;

    return (
        <div className="chat-config-container">
            
            <div className="config-panel">
                <h3>Cấu hình Cuộc Trò Chuyện</h3>

                <div className="participants-config-wrapper">

                    <div className="participant-box left-person">
                        <h4>Người A (Header & Left)</h4>
                        <input 
                            name="name"
                            placeholder="Tên người nhận (ví dụ: Huy Ngu)"
                            value={participantsConfig.personA.name}
                            onChange={(e) => handleParticipantChange(e, 'personA')}
                        />
                    </div>

                    <div className="participant-box right-person">
                        <h4>Người B (Của tôi & Right)</h4>
                        <input 
                            name="name"
                            placeholder="Tên của bạn (ví dụ: Bạn)"
                            value={participantsConfig.personB.name}
                            onChange={(e) => handleParticipantChange(e, 'personB')}
                        />
                    </div>

                </div>
                
                <hr className="config-divider" />

                <h3>Thêm Tin nhắn</h3>
                <form onSubmit={handleSubmit} className="message-form">

                    <div className="input-group">
                        <label>Người gửi:</label>
                        <select 
                            name="sendingParticipant" 
                            value={newMessage.sendingParticipant} 
                            onChange={(e) => setNewMessage({...newMessage, sendingParticipant: e.target.value})}
                        >
                            <option value="personA">{participantsConfig.personA.name} (Left)</option>
                            <option value="personB">{participantsConfig.personB.name} (Right)</option>
                        </select>
                    </div>

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
                </form>
                
                <button 
                    onClick={handleClearMessages} 
                    className="clear-message-btn" 
                    disabled={!hasMessages}
                >
                    <FaTrashAlt /> Xóa Hết Tin Nhắn
                </button>

                {!hasMessages && (
                    <p className="no-chat-message">
                        Hãy thêm tin nhắn đầu tiên để hiển thị giao diện chat.
                    </p>
                )}
            </div>

            {hasMessages && (
                <MobileChatWindow 
                    messageData={messages} 
                    chatPartnerName={participantsConfig.personA.name}
                    participantsConfig={participantsConfig} 
                />
            )}
            
        </div>
    );
};

export default ChatConfigurator;