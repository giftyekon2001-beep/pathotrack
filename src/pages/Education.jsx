import React, { useEffect, useState } from 'react';
import { educationAPI } from '../services/api';
import '../styles/education.css';

export default function Education() {
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEducationContent();
  }, []);

  const fetchEducationContent = async () => {
    try {
      const response = await educationAPI.getContent();
      setContent(response.data);
      setFilteredContent(response.data);
    } catch (err) {
      console.error('Failed to fetch education content', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(content.map(item => item.category))];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredContent(content);
    } else {
      setFilteredContent(content.filter(item => item.category === category));
    }
  };

  if (loading) return <div className="loading">Loading education content...</div>;

  return (
    <div className="education">
      <div className="container">
        <div className="education-header">
          <h1>Health Education Hub</h1>
          <p>Learn about infection prevention, hygiene, and public health</p>
        </div>

        <div className="categories-filter">
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="education-grid">
          {filteredContent.map(item => (
            <div key={item.id} className="education-card">
              <div className="card-header">
                <h3>{item.title}</h3>
                <span className="category-badge">{item.category}</span>
              </div>

              <p className="card-description">{item.description}</p>

              <div className="card-content">
                <p>{item.content}</p>
              </div>

              <div className="card-footer">
                <span className="tips-icon">💡</span>
                <span className="tips-text">Remember: Prevention is always better than treatment</span>
              </div>
            </div>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="empty-state">
            <p>No content found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}