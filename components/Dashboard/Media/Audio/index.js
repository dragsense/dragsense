import React from 'react';
import { AudioOutlined } from '@ant-design/icons';

const Audio = ({ src, alt }) => (
  <div style={{ position: 'relative' }}>
  <AudioOutlined  style={{ fontSize: 48, color: '#fff', zIndex: 1 }} />
    <audio  src={src} alt={alt} controls />
    
  </div>
);

export default Audio;