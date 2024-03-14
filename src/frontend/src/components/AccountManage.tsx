"use client";

import { useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";

const AccountManagePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [accountnumber, setAccountNumber] = useState("");
  const [bankname, setBankName] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Add logic to handle form submission
  };

  const handleBankChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBankName(event.target.value);
  };

  return (
    <form className="h-full w-full m-auto" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="border-b border-gray-900/10 pb-4">
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-3">
            <div className="sm:col-span-4">
              <h2 className="text-title">Account management</h2>
              <p className="text-standard font-semibold text-gray-700">
                Make changes to your personal information or account type.
              </p>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="name" className="label-normal">
                Email
              </label>
              <input
                id="email"
                type="text"
                placeholder="Email"
                className="form-input mt-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="surname" className="label-normal">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="form-input mt-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="username" className="label-normal">
                Phone Number
              </label>
              <input
                id="phonenum"
                type="text"
                placeholder="Phone number"
                className="form-input mt-2"
                value={phonenumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="sm:col-span-4">
              <p className="py-2 font-semibold text-gray-700">Payment method</p>
              <label htmlFor="surname" className="label-normal">
                Account Number
              </label>
              <input
                id="accountnum"
                type="text"
                placeholder="Account number"
                className="form-input mt-2"
                value={accountnumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="surname" className="label-normal">
                Bank
              </label>
              <select
                className="text-black form-input mt-2"
                id="bank-select"
                value={bankname}
                onChange={handleBankChange}
              >
                <option value="SCB">SCB</option>
                <option value="KBANK">KBANK</option>
                <option value="BBL">BBL</option>
                <option value="KTB">KTB</option>
                <option value="TTB">TTB</option>
                <option value="CIMB">CIMB</option>
                <option value="BAY">BAY</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default AccountManagePage;
