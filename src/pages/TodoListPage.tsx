import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TodoList } from '../components/TodoList';
import { TodoForm } from '../components/TodoForm';
import { useAuth } from '../hooks/useAuth';
import { useTodos } from '../hooks/useTodos';

function TodoListPage() {
  const { user, loading: isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { 
    todos,
    loading: todosLoading,
    error: todosError,
    stats,
    createTodo,
    deleteTodo,
    toggleTodoCompletion,
    updateTodo
  } = useTodos(user?.id);

  // 認証状態が変わったときにリダイレクト
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const [showAddForm, setShowAddForm] = useState(false);

  const handleTodoAdded = async (title: string, description: string) => {
    const newTodo = await createTodo(title, description);
    if (newTodo) {
      setShowAddForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
  };

  const handleToggleComplete = async (id: string) => {
    await toggleTodoCompletion(id);
  };

  const handleUpdate = async (id: string, title: string, description: string) => {
    await updateTodo(id, { title, description });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="p-8 text-center text-gray-600 bg-white rounded-lg shadow-md">
        読み込み中...
      </div>
    </div>;
  }

  if (!user) {
    return null; // ログインページにリダイレクト中
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary">Todoリスト</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <span className="text-gray-600 text-sm">
            {user.email}
          </span>
          <button 
            onClick={handleLogout} 
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            ログアウト
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-6">
        {showAddForm ? (
          <TodoForm 
            onTodoAdded={handleTodoAdded}
            onCancel={() => setShowAddForm(false)}
          />
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto bg-primary text-white font-medium py-2 px-4 rounded-md hover:bg-primary-dark transition duration-200 ease-in-out"
          >
            + 新しいTodoを追加
          </button>
        )}
        <TodoList 
          todos={todos}
          loading={todosLoading}
          error={todosError}
          stats={stats}
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
          onUpdate={handleUpdate}
        />
      </main>
    </div>
  );
}

export default TodoListPage;