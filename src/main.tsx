import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function App() {
  return (
    <div style={{fontFamily: 'Arial', background: '#f9fafb', minHeight: '100vh'}}>
      
      {/* Navbar */}
      <div style={{background: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <h2 style={{color: '#2563eb', margin: 0}}>CodeFlow</h2>
          <span style={{fontSize: '12px', fontWeight: 'bold'}}>E-LEARNING CODING CAMPUS</span>
        </div>
        <div style={{display: 'flex', gap: '15px'}}>
          <button style={{background: 'none', border: 'none', cursor: 'pointer'}}>Course Catalog</button>
          <button style={{background: 'none', border: 'none', cursor: 'pointer'}}>Peer Review Board</button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{textAlign: 'center', padding: '60px 20px'}}>
        <p style={{color: '#2563eb', fontWeight: 'bold', fontSize: '12px'}}>AI-AUGMENTED SANDBOX LEARNING</p>
        <h1 style={{fontSize: '40px', margin: '10px 0'}}>Curated Coding Modules & Custom Curriculums</h1>
        <p style={{color: '#555', maxWidth: '600px', margin: '0 auto 20px'}}>Master development hands-on. Compile code sandbox challenges, complete conceptual check-ups, and build real-world applications.</p>
        <button style={{padding: '12px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer'}}>
          Architect Custom AI Course
        </button>
      </div>

      {/* Course Filter Buttons */}
      <div style={{padding: '0 40px'}}>
        <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
          <button style={{padding: '8px 16px', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer'}}>All</button>
          <button style={{padding: '8px 16px', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer'}}>JavaScript</button>
          <button style={{padding: '8px 16px', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer'}}>Python</button>
          <button style={{padding: '8px 16px', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer'}}>React</button>
        </div>

        {/* Course Cards */}
        <div style={{background: 'white', padding: '20px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #eee'}}>
          <small style={{color: '#2563eb', fontWeight: 'bold'}}>JAVASCRIPT - INTERMEDIATE</small>
          <h3 style={{margin: '8px 0'}}>Mastering Async/Await in JavaScript</h3>
          <p style={{color: '#666'}}>Learn to handle asynchronous operations like a pro.</p>
        </div>

        <div style={{background: 'white', padding: '20px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #eee'}}>
          <small style={{color: '#16a34a', fontWeight: 'bold'}}>PYTHON - BEGINNER</small>
          <h3 style={{margin: '8px 0'}}>Python List Comprehensions & Filters</h3>
          <p style={{color: '#666'}}>Write cleaner and faster Python code.</p>
        </div>

        <div style={{background: 'white', padding: '20px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #eee'}}>
          <small style={{color: '#9333ea', fontWeight: 'bold'}}>REACT - INTERMEDIATE</small>
          <h3 style={{margin: '8px 0'}}>React Hooks Deep Dive</h3>
          <p style={{color: '#666'}}>Master useState, useEffect and custom hooks.</p>
        </div>
      </div>

    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
