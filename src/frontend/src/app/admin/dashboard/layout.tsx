"use client";
import {
  Header,
  Verification,
  SideNavbar,
  TicketStatCard,
} from "@/components/Admin";
import { useState, useEffect } from "react";
import adminService from "@/services/admin";
import { User } from "@/types/user";
import { IssueHeaderMetadata } from "@/types/issue";
import { NavBar } from "@/components/shared";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [issueCardHeader, setIssueCardHeader] = useState<IssueHeaderMetadata>();
  // const [selectedPage , setSelectedPage] = useState<string>("Verification Tickets");

  const fetchIssueCardHeader = async () => {
    try {
      const response = await adminService.GetIssueHeaderMetadata();
      if (response.data) setIssueCardHeader(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchIssueCardHeader();
  }, []);

  return (
    <div className="">
      <NavBar />
      <div className="flex flex-row">
        <div className="sm:w-2/12"><SideNavbar /></div>
        {/* TICKET COUNT */}
        <div className="flex flex-col w-full">
          <div className="p-4">
            <div className="grid sm:grid-cols-auto-fill-100 md:grid-cols-auto-fill-400 lg:grid-cols-4 gap-4">
              <TicketStatCard
                title="Pending Tickets"
                count={issueCardHeader?.pendingTickets || 0}
                color="green"
              />
              <TicketStatCard
                title="Tickets Today"
                count={issueCardHeader?.ticketsToday || 0}
                color="green"
              />
              <TicketStatCard
                title="Tickets Due Today"
                count={issueCardHeader?.ticketsDueToday || 0}
                color="green"
              />
              <TicketStatCard
                title="Closed Tickets"
                count={issueCardHeader?.closedTickets || 0}
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
