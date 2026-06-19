import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import SubmitDemand from "@/pages/SubmitDemand";
import MergeOrders from "@/pages/MergeOrders";
import CompareSuppliers from "@/pages/CompareSuppliers";
import ApproveOrders from "@/pages/ApproveOrders";
import Feedback from "@/pages/Feedback";

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/submit" element={<SubmitDemand />} />
          <Route path="/merge" element={<MergeOrders />} />
          <Route path="/compare" element={<CompareSuppliers />} />
          <Route path="/approve" element={<ApproveOrders />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
