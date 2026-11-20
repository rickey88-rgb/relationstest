import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canOpenLocalReport } from "../dev-report/access";
import LocalStorageLab from "./LocalStorageLab";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"PERSONA – isolerad lagringstest",robots:{index:false,follow:false}};
export default async function LocalStoragePage() {
  if(process.env.NODE_ENV!=="development"||!(await canOpenLocalReport()))notFound();
  // Opening the page does not create a session or database record.
  return <LocalStorageLab/>;
}
