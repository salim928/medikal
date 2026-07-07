import { Clock } from "lucide-react";
import type { Post } from "@/lib/marketing";

/** Card grid shared by the Blog (news) and Health Articles pages. */
export function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <article key={p.slug} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            {p.category === "news" ? "Company news" : "Health"}
          </p>
          <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-slate-900">{p.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{p.excerpt}</p>
          <p className="mt-4 flex items-center gap-3 text-xs text-slate-500">
            <span>{p.author}</span>
            <span>·</span>
            <span>{p.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.readMinutes} min read</span>
          </p>
        </article>
      ))}
    </div>
  );
}
