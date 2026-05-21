import React from 'react';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
    // Static announcement - can be toggled
    const isActive = true;
    const message = 'Free worldwide shipping on all orders — Limited time offer';
    const bgColor = '#c9a227';
    const textColor = '#000000';

    if (!isActive) return null;

    return (
        <div className="announcement-bar" style={{ backgroundColor: bgColor, color: textColor }}>
            {message}
        </div>
    );
};

export default AnnouncementBar;
