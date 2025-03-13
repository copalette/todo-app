import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUp, user, loading, error: authError } = useAuth();
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

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    try {
      setError(null);
      
      const result = await signUp(email, password);
      if (result) {
        navigate('/todo'); // 登録成功後、TodoListPageに遷移
      }
    } catch (err) {
      console.error('アカウント登録に失敗しました:', err);
      setError(err instanceof Error ? err.message : 'アカウント登録に失敗しました。別のメールアドレスを試してください。');
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
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">アカウント登録</h1>
        
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
            <p className="text-xs text-gray-500 mt-1">6文字以上で入力してください</p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
              パスワード（確認）
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out"
          >
            登録する
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            既にアカウントをお持ちの方は
            <Link to="/login" className="text-primary hover:underline ml-1">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;