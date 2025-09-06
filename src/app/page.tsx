// app/page.tsx  (SERVER component)
import { redirect } from "next/navigation";
export default function Home() {
  redirect("/admin");
}
