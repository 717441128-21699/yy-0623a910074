import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useProcurementStore } from "@/store/useProcurementStore";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  const { currentRole } = useProcurementStore();

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar role={currentRole} />
        <main className="flex-1 min-w-0 px-8 py-8">
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
