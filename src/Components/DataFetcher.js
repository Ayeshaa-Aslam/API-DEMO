import { useState, useEffect } from "react";

function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        async function fetchPosts() {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(
                    "https://jsonplaceholder.typicode.com/posts",
                    { signal: controller.signal }
                );

                if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
                const data = await res.json();

                setPosts(data);
            } 
            catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Something went wrong");
                }
            } 
            finally {
                setLoading(false);
            }
        }
        fetchPosts();
        return () => controller.abort();
    }, []);

    return (
        <main style={{ fontFamily: "system-ui, sans-serif", padding: "24px", maxWidth: 800, margin: "0 auto" }}>
            <h1 style={{ marginBottom: 12 }}>Posts</h1>
            {loading && <p>Loading...</p>}
            {error && (
                <p role="alert" style={{ color: "crimson" }}>
                    Error: {error}
                </p>
            )}
            {!loading && !error && (
                <ul style={{ lineHeight: 1.6 }}>
                    {posts.map((post) => (
                        <li key={post.id}>{post.title}</li>
                    ))}
                </ul>
            )}
        </main>
    );
}
export default Posts;