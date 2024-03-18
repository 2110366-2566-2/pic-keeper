const PendingVerification = () => {
  return (
    <div className="space-y-4">
      <div className="border-b border-gray-900/10 pb-4">
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          <div className="sm:col-span-2">
            <h2 className="text-title">My Galleries</h2>
            <p className="text-standard font-semibold text-amber-500 pt-4">
              Photographer status: Pending approval
            </p>
            <p className="text-standard font-semibold text-amber-500">
              Verification may take 3 - 7 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingVerification;
