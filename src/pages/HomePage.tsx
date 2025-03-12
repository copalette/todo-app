import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-primary mb-4 text-center">Todoアプリへようこそ</h1>
                <p className="text-gray-600 mb-8 text-center">
                    このアプリでは、タスクを簡単に管理することができます。<br />
                    始めるには、ログインまたは新規登録してください。
                </p>
                
                <div className="flex justify-center space-x-4">
                    <Link 
                        to="/login" 
                        className="px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition duration-200 ease-in-out"
                    >
                        ログイン
                    </Link>
                    <Link 
                        to="/register" 
                        className="px-6 py-2 border border-primary text-primary font-medium rounded-md hover:bg-gray-100 transition duration-200 ease-in-out"
                    >
                        新規登録
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HomePage;