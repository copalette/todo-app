# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# Todoアプリ - Supabase設定ガイド

このTodoアプリはSupabaseをバックエンドとして使用しています。以下の手順でSupabaseのテーブルを設定してください。

## Supabaseプロジェクトの設定

1. [Supabase](https://supabase.com/)にアクセスし、アカウントを作成またはログインします
2. 新しいプロジェクトを作成します
3. プロジェクトが作成されたら、プロジェクトのURLと匿名キーをコピーします
4. `.env.example`ファイルをコピーして`.env`ファイルを作成し、コピーしたURLと匿名キーを設定します

## データベーステーブルの作成

Supabaseのダッシュボードから以下のSQLを実行してテーブルを作成します：

```sql
-- Todosテーブル
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLSポリシーの設定（行レベルセキュリティ）
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のTodoのみ参照可能
CREATE POLICY "ユーザーは自分のTodoのみ参照可能" ON todos
  FOR SELECT USING (auth.uid() = user_id);

-- ユーザーは自分のTodoのみ作成可能
CREATE POLICY "ユーザーは自分のTodoのみ作成可能" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のTodoのみ更新可能
CREATE POLICY "ユーザーは自分のTodoのみ更新可能" ON todos
  FOR UPDATE USING (auth.uid() = user_id);

-- ユーザーは自分のTodoのみ削除可能
CREATE POLICY "ユーザーは自分のTodoのみ削除可能" ON todos
  FOR DELETE USING (auth.uid() = user_id);

-- 更新時にupdated_atを自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_todos_updated_at
BEFORE UPDATE ON todos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

## 認証設定

1. Supabaseダッシュボードの「Authentication」セクションに移動します
2. 「Settings」タブで「Email Auth」が有効になっていることを確認します
3. 必要に応じて「Site URL」と「Redirect URLs」を設定します

## アプリの起動

環境変数を設定した後、以下のコマンドでアプリを起動できます：

```bash
npm install
npm run dev
```
