import './styles/App.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import { HomePage,LoginPage,TodoListPage,TodoEditPage,RegisterPage } from './pages'
import { AuthProvider } from './contexts/AuthContext'

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/todo" element={<TodoListPage />} />
            <Route path="/todo/:id/edit" element={<TodoEditPage/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
