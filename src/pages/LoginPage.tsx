import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, user, loading, error: authError } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // ユーザーが既にログインしている場合はTodoページにリダイレクト
  useEffect(() => {
    if (user && !loading) {
      navigate('/todo');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    try {
      setError(null);
      
      const result = await signIn(email, password);
      if (result) {
        navigate('/todo'); // ログイン成功後、TodoListPageに遷移
      }
    } catch (err) {
      console.error('ログインに失敗しました:', err);
      setError(err instanceof Error ? err.message : 'ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    }
  };

  // authErrorがある場合はそれを表示
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="p-8 text-center text-gray-600 bg-white rounded-lg shadow-md">
        読み込み中...
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">ログイン</h1>
        
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out"
          >
            ログイン
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            アカウントをお持ちでない方は
            <Link to="/register" className="text-primary hover:underline ml-1">
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
