import type { Metadata } from "next";
import PersonaShell from "../persona/_components/PersonaShell";
export const metadata: Metadata = {
  title:"PERSONA – Vem är du egentligen?",
  robots:{index:false,follow:false,googleBot:{index:false,follow:false}},
};
export default function Layout({children}:{children:React.ReactNode}) {
  return <PersonaShell homePath="/persona-v61">{children}</PersonaShell>;
}
