import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function App() {
  const [filter, setFilter] = useState('All')

  const courses = [
    { title: 'Mastering Async/Await in JavaScript', level: 'JAVASCRIPT - INTERMEDIATE', desc: 'Learn to handle asynchronous operations like a pro.', color: '#2563eb' },
    { title: 'Python List Comprehensions & Filters', level: 'PYTHON - BEGINNER', desc: 'Write cleaner and faster Python code.', color: '#16a34a' },
    { title: 'React Hooks Deep Dive', level: 'REACT - INTERMEDIATE', desc: 'Master useState, useEffect and custom hooks.', color: '#9333ea' }
  ]

  const filteredCourses = filter === 'All' ? courses : courses.filter(c => c.level.includes(filter.toUpperCase()))

  return (
    <div style={{fontFamily: 'Arial', background: '#f9fafb', minHeight: '100vh'}}>
      
      {/* Navbar */}
      <div style={{background: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd'}}>
        <h2 style={{color: '#2563eb', margin: 0}}>CodeFlow</h2>
        <span style={{fontSize: '12px', fontWeight: 'bold'}}>E-LEARNING CODING CAMPUS</span>
      </div>

      {/* Hero Section */}
      <div style={{textAlign: 'center', padding: '60px 20px'}}>
        <p style={{color: '#2563eb', fontWeight: 'bold', fontSize: '12px'}}>AI-AUGMENTED SANDBOX LEARNING</p>
        <h1 style={{fontSize: '40px', margin: '10px 0'}}>Curated Coding Modules & Custom Curriculums</h1>
        <p style={{color: '#555', maxWidth: '600px', margin: '0 auto 20px'}}>Master development hands-on. Compile code sandbox challenges.</p>
        <button onClick={() => alert('AI Course Builder coming soon! 🔥')} 
          style={{padding: '12px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer'}}>
          Architect Custom AI Course
        </button>
      </div>

      {/* Course Filter Buttons */}
      <div style={{padding: '0 40px'}}>
        <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
          <button onClick={() => setFilter('All')} style={{padding: '8px 16px', border: '1px solid #ddd', borderRadius: '6px', background: filter==='All'?'#2563eb':'white', color: filter==='All'?'white':'black', cursor: 'pointer'}}>All</button>
          <button onClick={() => setFilter('JavaScript')} style={{padding: '8px 16px', border: '1px solid #ddd', borderRadius: '6px', background: filter==='JavaScript'?'#2563eb':'white', color: filter==='JavaScript'?'white':'black', cursor: 'pointer'}}>JavaScript</button>
          <button onClick={() => setFilter('Python')} style={{padding: '8px 16px', border: '1px solid #ddd', borderRadius: '6px', background: filter==='Python'?'#2563eb':'white', color: filter==='Python'?'white':'black', cursor: 'pointer'}}>Python</button>
          <button onClick={() => setFilter('React')} style={{padding: '8px 16px', border: '1px solid #ddd', borderRadius: '6px', background: filter==='React'?'#2563eb':'white', color: filter==='React'?'white':'black', cursor: 'pointer'}}>React</button>
        </div>

        {/* Course Cards */}
        {filteredCourses.map((course, i) => (
          <div key={i} style={{background: 'white', padding: '20px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #eee'}}>
            <small style={{color: course.color, fontWeight: 'bold'}}>{course.level}</small>
            <h3 style={{margin: '8px 0'}}>{course.title}</h3>
            <p style={{color: '#666'}}>{course.desc}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
