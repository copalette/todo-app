import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div className="home-page">
            <div className="home-container">
                <h1 className="home-title">Todoアプリへようこそ</h1>
                <p className="home-description">
                    このアプリでは、タスクを簡単に管理することができます。
                    始めるには、ログインまたは新規登録してください。
                </p>
                
                <div className="home-buttons">
                    <Link to="/login" className="home-button login-button">
                        ログイン
                    </Link>
                    <Link to="/register" className="home-button register-button">
                        新規登録
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HomePage;