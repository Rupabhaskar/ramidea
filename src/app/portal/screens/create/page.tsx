import { redirect } from "next/navigation";

export default function CreateScreenRedirect() {
  redirect("/portal/screens?add=1");
}
