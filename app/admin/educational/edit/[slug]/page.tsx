import ArticleForm from "../../[action]/page";

export default function EditArticlePage({ params }: { params: { slug: string } }) {
  return <ArticleForm params={{ action: "edit", slug: params.slug }} />;
} 