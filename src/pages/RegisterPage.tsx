import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../lib/supabase';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      setIsLoading(true);
      setError(null);
      
      await authService.signUp(email, password);
      navigate('/todo'); // 登録成功後、TodoListPageに遷移
    } catch (err) {
      console.error('アカウント登録に失敗しました:', err);
      setError('アカウント登録に失敗しました。別のメールアドレスを試してください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-primary text-center mb-6">新規登録</h1>
        
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
              パスワード（確認）
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
              className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out"
          >
            {isLoading ? '登録中...' : '登録する'}
          </button>
        </form>
        
        <div className="text-center text-gray-600">
          <p className="mb-2">
            すでにアカウントをお持ちの方は
            <Link to="/login" className="text-primary font-medium ml-1 hover:underline">
              ログイン
            </Link>
          </p>
          <p>
            <Link to="/" className="text-primary font-medium hover:underline">
              ホームに戻る
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;