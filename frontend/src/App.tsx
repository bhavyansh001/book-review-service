import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import HomePage from './pages/HomePage'
import BookDetailPage from './pages/BookDetailPage'
import AddBookPage from './pages/AddBookPage'
import EditBookPage from './pages/EditBookPage'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/books/new" element={<AddBookPage />} />
          <Route path="/books/:id/edit" element={<EditBookPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
