import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/marketing/shell";
import { PostGrid } from "@/components/marketing/PostGrid";
import { posts } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Health Articles",
  description: "Plain-language health guidance written by medicom clinicians.",
};

export default function ArticlesPage() {
  const health = posts.filter((p) => p.category === "health");
  return (
    <>
      <PageHero
        eyebrow="Health articles"
        title="Health guidance you can actually use"
        subtitle="Written by medicom clinicians in plain language — no jargon, no fearmongering, just what to do next."
      />
      <section className="py-16">
        <div className="container">
          <PostGrid posts={health} />
        </div>
      </section>
      <CtaBand
        title="Have a question an article can't answer?"
        body="Talk to a licensed doctor in minutes."
        cta="Book a visit"
      />
    </>
  );
}
