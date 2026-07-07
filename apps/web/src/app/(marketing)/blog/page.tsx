import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/marketing/shell";
import { PostGrid } from "@/components/marketing/PostGrid";
import { posts } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Blog",
  description: "News and updates from the medicom team.",
};

export default function BlogPage() {
  const news = posts.filter((p) => p.category === "news");
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="News from medicom"
        subtitle="Product launches, partnerships, and what we're learning building virtual care for Ghana."
      />
      <section className="py-16">
        <div className="container">
          <PostGrid posts={news} />
        </div>
      </section>
      <CtaBand title="See medicom in action" body="Everything you read about is one sign-up away." />
    </>
  );
}
