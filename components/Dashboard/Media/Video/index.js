import React from 'react';

const Video = ({ src, alt, mimetype }) =>  {

return <div style={{ position: 'relative', padding: '56.25% 0 0 0', height: '0' }}>
    <video
      
      alt={alt}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
      controls
    >
     <source src={src} type={mimetype} />
  Your browser does not support the video tag.
      </video>
  </div>
}


export default Video;