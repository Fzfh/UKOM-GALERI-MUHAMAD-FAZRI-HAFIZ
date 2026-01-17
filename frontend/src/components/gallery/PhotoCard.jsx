import React from 'react';
import { Link } from 'react-router-dom';

const PhotoCard = ({ photo }) => {
  return (
    <div className="photo-card">
      <Link to={`/photo/${photo.id}`}>
        <img 
          src={`http://localhost:5000${photo.file}`} 
          alt={photo.judul}
        />
        <div className="photo-info">
          <h3>{photo.judul}</h3>
          <p>{photo.deskripsi}</p>
          <span className="category">{photo.category_name}</span>
        </div>
      </Link>
    </div>
  );
};

export default PhotoCard;