import { authRepository } from '../repositories/authRepository';
import { User } from '../types';

// 認証サービス - ビジネスロジック層
export const authService = {
  // サインアップ
  async signUp(email: string, password: string) {
    // 入力値の検証
    if (!email || !password) {
      throw new Error('メールアドレスとパスワードは必須です');
    }
    
    // メールアドレスの形式を検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('有効なメールアドレスを入力してください');
    }
    
    // パスワードの強度を検証
    if (password.length < 6) {
      throw new Error('パスワードは6文字以上である必要があります');
    }
    
    return authRepository.signUp(email, password);
  },

  // ログイン
  async signIn(email: string, password: string) {
    // 入力値の検証
    if (!email || !password) {
      throw new Error('メールアドレスとパスワードは必須です');
    }
    
    try {
      return await authRepository.signIn(email, password);
    } catch (error) {
      // エラーメッセージをユーザーフレンドリーに変換
      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('メールアドレスまたはパスワードが正しくありません');
        }
      }
      throw error;
    }
  },

  // ログアウト
  async signOut() {
    return authRepository.signOut();
  },

  // 現在のユーザーを取得
  async getCurrentUser(): Promise<User | null> {
    return authRepository.getCurrentUser();
  },

  // ユーザーの認証状態を監視
  onAuthStateChange(callback: (user: User | null) => void) {
    return authRepository.onAuthStateChange(callback);
  },

  // ユーザーが認証済みかどうかを確認
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }
}; 