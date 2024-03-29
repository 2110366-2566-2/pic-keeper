"use client";
import {
  Header,
  Verification,
  SideNavbar,
  TicketStatCard,
} from "@/components/Admin";
import { useState, useEffect } from "react";
import adminService from "@/services/admin";
import { IssueHeaderMetadata } from "@/types/issue";
import { NavBar } from "@/components/shared";
import { useErrorModal } from "@/hooks/useErrorModal";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [issueCardHeader, setIssueCardHeader] = useState<IssueHeaderMetadata>();
  const [selected, setSelected] = useState<string>("verification-tickets");
  const showError = useErrorModal();
  
  const fetchIssueCardHeader = async () => {
    try {
      const response = await adminService.GetIssueHeaderMetadata();
      if (response.data) {setIssueCardHeader(response.data)};
    } catch (error) {
      showError(error);
    }
  };
  useEffect(() => {
    fetchIssueCardHeader();
  }, []);

  return (
    <div className="">
      <div className="w-full">
        <NavBar />
      </div>
      <div className="flex flex-row">
        <div className="sm:w-64">
          <SideNavbar/>
        </div>
        {/* TICKET COUNT */}
        <div className="flex flex-col w-full">
          <div className="p-4">
            <div className="grid sm:grid-cols-auto-fill-100 md:grid-cols-auto-fill-400 lg:grid-cols-4 gap-4">
              <TicketStatCard
                title="Pending Tickets"
                count={issueCardHeader?.pending_tickets || 0}
                color="green"
              />
              <TicketStatCard
                title="Tickets Today"
                count={issueCardHeader?.tickets_today || 0}
                color="green"
              />
              <TicketStatCard
                title="Tickets Due Today"
                count={issueCardHeader?.tickets_dueToday || 0}
                color="green"
              />
              <TicketStatCard
                title="Closed Tickets"
                count={issueCardHeader?.closed_tickets || 0}
                color="green"
              />
            </div>
          </div>
          <div className="p-4">
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
