import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { todoService } from '../services/todoService';
import { useAuth } from '../hooks/useAuth';
import { Todo } from '../types';

function TodoEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [todo, setTodo] = useState<Todo | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTodo = async () => {
            if (!id) return;
            try {
                const fetchedTodo = await todoService.getTodoById(id);
                if (!fetchedTodo) {
                    setError('Todoが見つかりませんでした');
                    return;
                }
                setTodo(fetchedTodo);
                setTitle(fetchedTodo.title);
                setDescription(fetchedTodo.description);
            } catch (err) {
                setError('Todoの取得に失敗しました');
                console.error('Todoの取得に失敗しました:', err);
            }
        };

        fetchTodo();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !user) return;

        setIsLoading(true);
        setError(null);

        try {
            await todoService.updateTodo(id, {
                title,
                description
            });
            navigate('/todo');
        } catch (err) {
            setError('Todoの更新に失敗しました');
            console.error('Todoの更新に失敗しました:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-600">{error}</p>
                    <Link to="/todo" className="text-blue-600 hover:underline mt-2 inline-block">
                        Todoリストに戻る
                    </Link>
                </div>
            </div>
        );
    }

    if (!todo) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-gray-600">読み込み中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Todoを編集</h1>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                            タイトル
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                            説明
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400"
                        >
                            {isLoading ? '更新中...' : '更新する'}
                        </button>
                        <Link
                            to="/todo"
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
                        >
                            キャンセル
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TodoEditPage;