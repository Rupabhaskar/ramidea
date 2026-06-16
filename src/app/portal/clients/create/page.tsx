import { redirect } from "next/navigation";

export default function CreateClientRedirect() {
  redirect("/portal/clients?create=1");
}
