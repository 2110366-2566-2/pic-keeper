'use client'
import { Verification } from "@/components/Admin";

const VerificationTickets = () => {
    return (
        <div className="space-y-4">
            <div className="text-2xl font-bold text-gray-800"> 
                Verification Tickets
            </div>
            <Verification/>
        </div>
    )
};

export default VerificationTickets;