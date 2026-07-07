import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function App() {
  const [filter, setFilter] = useState('All')
  const [page, setPage] = useState('home')
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [selectedOption, setSelectedOption] = useState('')
  const [showResult, setShowResult] = useState(false)

  const courses = [
    { 
      id: 1, title: 'Mastering Async/Await in JavaScript', level: 'JAVASCRIPT - INTERMEDIATE', 
      desc: 'Learn to handle asynchronous operations like a pro.', color: '#2563eb',
      quiz: { q: 'async function lo await ela use chestham?', 
              options: ['await keyword tho', 'then() tho', 'callback tho'], 
              answer: 'await keyword tho' }
    },
    { 
      id: 2, title: 'Python List Comprehensions & Filters', level: 'PYTHON - BEGINNER', 
      desc: 'Write cleaner and faster Python code.', color: '#16a34a',
      quiz: { q: 'List comprehension correct syntax?', 
              options: ['[x for x in list]', '(x for x in list)', '{x for x in list}'], 
              answer: '[x for x in list]' }
    },
    { 
      id: 3, title: 'React Hooks Deep Dive', level: 'REACT - INTERMEDIATE', 
      desc: 'Master useState, useEffect and custom hooks.', color: '#9333ea',
      quiz: { q: 'useState enti return chesthundi?', 
              options: ['Value and Function', 'Only Value', 'Only Function'], 
              answer: 'Value and Function' }
    }
  ]

  const filteredCourses = filter === 'All' ? courses : courses.filter(c => c.level.includes(filter.toUpperCase()))

  const startQuiz = (course: any) => {
    setSelectedCourse(course)
    setPage('quiz')
    setSelectedOption('')
    setShowResult(false)
  }

  const submitQuiz = () => {
    if(selectedOption === '') {
      alert('Please select one option!')
      return
    }
    setShowResult(true)
  }

  if(page === 'quiz') {
    const isCorrect = selectedOption === selectedCourse.quiz.answer
    return (
      <div style={{padding: '40px', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto', background: '#f9fafb', minHeight: '100vh'}}>
        <button onClick={() => setPage('home')} style={{marginBottom: '20px', padding: '8px 16px', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '6px', background: 'white'}}>← Back to Courses</button>
        <h2>{selectedCourse.title}</h2>
        <p style={{color: '#666'}}>{selectedCourse.desc}</p>
        
        <div style={{background: 'white', padding: '30px', borderRadius: '8px', marginTop: '20px', border: '1px solid #ddd'}}>
          <h3>Quiz: 1 Question 📝</h3>
          <p style={{fontSize: '18px', fontWeight: 'bold'}}>{selectedCourse.quiz.q}</p>
          
          {selectedCourse.quiz.options.map((opt: string) => (
            <button key={opt} onClick={() => setSelectedOption(opt)} 
              style={{display: 'block', margin: '10px 0', padding: '12px', width: '100%', textAlign: 'left', 
              background: selectedOption===opt?'#2563eb':'white', color: selectedOption===opt?'white':'black', 
              border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '16px'}}>
              {opt}
            </button>
          ))}

          {!showResult && <button onClick={submitQuiz} style={{padding: '12px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px', fontSize: '16px'}}>Submit Answer</button>}
          
          {showResult && (
            <div style={{marginTop: '20px', padding: '15px', background: isCorrect?'#d1fae5':'#fee2e2', borderRadius: '6px'}}>
              <h4 style={{color: isCorrect?'#16a34a':'#dc2626', margin: 0}}>{isCorrect ? 'Correct! 🎉' : 'Wrong! ❌'}</h4>
              {!isCorrect && <p style={{margin: '5px 0 0 0'}}>Correct Answer: <b>{selectedCourse.quiz.answer}</b></p>}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{fontFamily: 'system-ui', background: '#f9fafb', minHeight: '100vh'}}>
      
      <div style={{background: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <div style={{background: '#2563eb', color: 'white', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold'}}>C</div>
          <h2 style={{margin: 0}}>CodeFlow</h2>
        </div>
        <div style={{display: 'flex', gap: '20px'}}>
          <span style={{cursor: 'pointer'}}>Course Catalog</span>
          <span style={{cursor: 'pointer'}}>Peer Review Board</span>
        </div>
      </div>

      <div style={{textAlign: 'center', padding: '60px 20px'}}>
        <p style={{color: '#2563eb', fontWeight: 'bold', fontSize: '12px'}}>AI-AUGMENTED SANDBOX LEARNING</p>
        <h1 style={{fontSize: '40px', margin: '10px 0'}}>Curated Coding Modules & Custom AI Curriculums</h1>
        <p style={{color: '#555', maxWidth: '600px', margin: '0 auto 20px'}}>Master development hands-on. Compile code sandbox challenges, complete conceptual check-ups.</p>
        <button onClick={() => alert('AI Course Builder coming soon! 🔥')} 
          style={{padding: '12px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer'}}>
          ✨ Architect Custom AI Course
        </button>
      </div>

      <div style={{padding: '0 40px', maxWidth: '1000px', margin: '0 auto'}}>
        <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
          {['All', 'JavaScript', 'Python', 'React'].map(btn => (
            <button key={btn} onClick={() => setFilter(btn)} 
              style={{padding: '8px 16px', border: '1px solid #ddd', borderRadius: '6px', 
              background: filter===btn?'#2563eb':'white', color: filter===btn?'white':'black', cursor: 'pointer'}}>
              {btn}
            </button>
          ))}
        </div>

        {filteredCourses.map((course) => (
          <div key={course.id} onClick={() => startQuiz(course)} 
            style={{background: 'white', padding: '20px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #eee', cursor: 'pointer'}}>
            <small style={{color: course.color, fontWeight: 'bold'}}>{course.level}</small>
            <h3 style={{margin: '8px 0'}}>{course.title}</h3>
            <p style={{color: '#666'}}>{course.desc}</p>
            <small style={{color: '#2563eb', fontWeight: 'bold'}}>Click to Start Quiz →</small>
          </div>
        ))}
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
