import './styles/App.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import { HomePage,LoginPage,TodoListPage,TodoEditPage,RegisterPage } from './pages'
import { createClient } from '@supabase/supabase-js'

// Supabaseクライアントの初期化
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {

  return (
  <Router>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/todo" element={<TodoListPage />} />
        <Route path="/todo/:id/edit" element={<TodoEditPage/>}/>
    </Routes>
  </Router>
  
  )
}

export default App
