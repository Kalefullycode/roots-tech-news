import { useParams, Link } from 'react-router-dom';

function BlogPostPage() {
  const { slug } = useParams();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/blog" className="text-sm text-primary hover:underline">← Back to Blog</Link>
      </div>
      <h1 className="text-2xl font-bold mb-2">Blog Post</h1>
      <p className="text-muted-foreground mb-6">Slug: {slug}</p>
      <p>Coming soon.</p>
    </main>
  );
}

export default BlogPostPage;









