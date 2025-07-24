import './style.css';
function Error({ error }: { error: string }) {
    return (
        <div className="error-page">
            <h1>Error</h1>
            <p>{error}</p>
        </div>
    );

}

export default Error;