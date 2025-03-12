import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../lib/supabase';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await authService.signIn(email, password);
      navigate('/todo'); // ログイン成功後、TodoListPageに遷移
    } catch (err) {
      console.error('ログインに失敗しました:', err);
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">ログイン</h1>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="auth-button"
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            アカウントをお持ちでない方は
            <Link to="/register" className="auth-link">新規登録</Link>
          </p>
          <p>
            <Link to="/" className="auth-link">ホームに戻る</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
