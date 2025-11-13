import React, { useState } from "react";
import "../styles/blog.css";

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  date: string;
  category: string;
  image: string;
  content: string;
}

const Blog: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Understanding the Future of Finance",
      summary: "Dive deep into the evolving landscape of finance and what it means for businesses and consumers alike.",
      date: "Sep 20, 2025",
      category: "Finance",
      image: "/src/assets/blog1.jpg",
      content: "Full article content about the future of finance..."
    },
    {
      id: 2,
      title: "Tips for Effective Financial Planning",
      summary: "Learn actionable strategies to manage your finances and plan for a secure future.",
      date: "Sep 18, 2025",
      category: "Planning",
      image: "/src/assets/blog2.jpg",
      content: "Full article content about financial planning..."
    },
    {
      id: 3,
      title: "Top Credit Cards for Cashback",
      summary: "Maximize your spending with the right credit cards tailored for rewards.",
      date: "Sep 15, 2025",
      category: "Credit Cards",
      image: "/src/assets/blog3.jpg",
      content: "Full article content about top credit cards..."
    },
    {
      id: 4,
      title: "Tips for First-Time Home Buyers",
      summary: "Understand the mortgage process and make an informed decision.",
      date: "Sep 10, 2025",
      category: "Home Loans",
      image: "/src/assets/blog4.png",
      content: "Full article content for first-time home buyers..."
    },
  ];

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section className="blog-container">
      {/* Header */}
      <header className="blog-header">
        <h1 className="blog-title">Insights & Stories</h1>
        <p className="blog-subtitle">Stay updated with the latest trends and insights in finance.</p>
      </header>

      {/* Featured Post */}
      {!selectedPost && (
        <>
          <div className="featured-post fade-in">
            <img src={blogPosts[0].image} alt={blogPosts[0].title} className="featured-image"/>
            <div className="featured-text">
              <span className="category-badge">{blogPosts[0].category}</span>
              <h2>{blogPosts[0].title}</h2>
              <p>{blogPosts[0].summary}</p>
              <span className="post-date">{blogPosts[0].date}</span>
              <button className="read-more-btn" onClick={() => setSelectedPost(blogPosts[0])}>Read More</button>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="blog-grid">
            {blogPosts.slice(1).map(post => (
              <div key={post.id} className="blog-card fade-in">
                <img src={post.image} alt={post.title} className="blog-card-image" />
                <div className="blog-card-content">
                  <span className="category-badge">{post.category}</span>
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-summary">{post.summary}</p>
                  <span className="post-date">{post.date}</span>
                  <button className="read-more-btn" onClick={() => setSelectedPost(post)}>Read More</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Full Blog Content */}
      {selectedPost && (
        <div className="full-blog fade-in">
          <button className="back-btn" onClick={() => setSelectedPost(null)}>← Back to Blog</button>
          <h2>{selectedPost.title}</h2>
          <span className="category-badge">{selectedPost.category}</span>
          <span className="post-date">{selectedPost.date}</span>
          <img src={selectedPost.image} alt={selectedPost.title} className="full-blog-image" />
          <p>{selectedPost.content}</p>
        </div>
      )}
    </section>
  );
};

export default Blog;
