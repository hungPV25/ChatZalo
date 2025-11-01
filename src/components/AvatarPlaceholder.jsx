// src/components/AvatarPlaceholder.js (ĐÃ CẬP NHẬT)

import React from 'react';
import { FaUser } from 'react-icons/fa'; 
import './AvatarPlaceholder.css'; 

const AvatarPlaceholder = ({ size = 48, id = 0, className = '' }) => {

    
    const backgroundColor = '#e0e0e0'; 
    const iconColor = '#9e9e9e';      

    return (
        <div 
            className={`avatar-placeholder ${className}`} 
            style={{ 
                width: size, 
                height: size,
                backgroundColor: backgroundColor,
                display: 'flex',            
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <FaUser size={size * 0.6} color={iconColor} /> 
        </div>
    );
};

export default AvatarPlaceholder;