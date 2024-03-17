function Verification(){
    return (
        <div className="flex flex-col">
        {/* Stats cards */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {/* Pending Tickets */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-600 bg-opacity-75">
                {/* Icon */}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Tickets
                </p>
                <p className="text-3xl font-bold text-gray-800">234</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-600 bg-opacity-75">
                {/* Icon */}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                    Tickets today
                </p>
                <p className="text-3xl font-bold text-gray-600">+15</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-600 bg-opacity-75">
                {/* Icon */}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">
                  Tickets due today
                </p>
                <p className="text-3xl font-bold text-red-600">234</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-600 bg-opacity-75">
                {/* Icon */}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Closed tickets
                </p>
                <p className="text-3xl font-bold text-gray-800">234</p>
              </div>
            </div>
          </div>


        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-normal text-left text-gray-500">
                  ID
                </th>
                <th className="px-6 py-3 font-normal text-left text-gray-500">
                  Requested by
                </th>
                <th className="px-6 py-3 font-normal text-left text-gray-500">
                  Additional info
                </th>
                <th className="px-6 py-3 font-normal text-left text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 font-normal text-left text-gray-500">
                  Created date
                </th>
                <th className="px-6 py-3 font-normal text-left text-gray-500">
                  Due date
                </th>
                <th className="px-6 py-3 font-normal text-left text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">

              {/* MOCK DATA */}
              <tr>
                <td className="px-6 py-4 text-gray-900">#09893</td>
                <td className="px-6 py-4 text-gray-900">Korakrit V.</td>
                <td className="px-6 py-4 text-gray-900">2 Years of experience</td>
                <td className="px-6 py-4 text-green-500">Approved</td>
                <td className="px-6 py-4 text-gray-900">17/2/24</td>
                <td className="px-6 py-4 text-gray-900">17/3/24</td>
                <td className="px-6 py-4 text-gray-900">...</td>
                {/* Other cells */}
              </tr>


            </tbody>
          </table>
        </div>
      </div>
    )
}

export default Verification