import { redirect } from "next/navigation";

export default function CreateScreenGroupRedirect() {
  redirect("/portal/screens/groups?create=1");
}
