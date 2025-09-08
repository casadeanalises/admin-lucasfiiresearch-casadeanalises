import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { redirect } from "next/navigation";
import HomeVideosAdminClient from "./home-videos-admin-client";

export default async function HomeVideosPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  const decoded = token ? await verifyJWT(token) : null;
  
  if (!decoded || decoded.type !== "admin") {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <HomeVideosAdminClient />
    </div>
  );
}