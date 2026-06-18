import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/article/ArticleCard";
import Avatar from "@/components/ui/Avatar";
import { getAuthorByUsername } from "@/lib/articles-db";
import { getSiteBranding } from "@/lib/site-branding";

type PageProps = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const author = await getAuthorByUsername(username);
  if (!author) return { title: "Author not found" };

  return {
    title: `${author.name} — OrbitSphere`,
    description: author.bio ?? `Articles by ${author.name} at OrbitSphere.`,
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const { username } = await params;
  const [author, branding] = await Promise.all([
    getAuthorByUsername(username),
    getSiteBranding(),
  ]);

  if (!author) notFound();

  return (
    <div className="container-main py-12 sm:py-16">
      <div className="gold-rule" />
      <div className="flex flex-wrap items-start gap-6 mb-10">
        <Avatar initials={author.initials} size="lg" />
        <div>
          <p className="font-ui text-xs uppercase tracking-widest text-text-muted mb-2">
            {branding.siteNamePrimary}
            {branding.siteNameAccent} · Staff
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-black text-foreground mb-2">
            {author.name}
          </h1>
          <p className="font-ui text-sm text-text-muted capitalize mb-3">
            {author.role} · {author.articleCount} published{" "}
            {author.articleCount === 1 ? "article" : "articles"}
          </p>
          {author.bio && (
            <p className="text-text-secondary max-w-2xl leading-relaxed">{author.bio}</p>
          )}
        </div>
      </div>

      {author.articles.length === 0 ? (
        <p className="text-text-muted text-sm">No published articles yet.</p>
      ) : (
        <section>
          <h2 className="font-serif text-xl font-bold text-foreground mb-6">Latest work</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {author.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-10 text-sm text-text-muted">
        <Link href="/" className="text-gold hover:underline">
          ← Back to homepage
        </Link>
      </p>
    </div>
  );
}
