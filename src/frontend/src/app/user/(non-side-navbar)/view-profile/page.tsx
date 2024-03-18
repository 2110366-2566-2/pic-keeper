const Home = () => {
  return (
    <main>
      Profile
      <div className="w-full rounded-md h-32 shadow-md space-x-2 grid grid-cols-7 relative">
        <div className="rounded-full bg-black">PIC</div>
        <div className="flex flex-col col-span-5">
          <div className="text-2xl">Username</div>
          <div className="flex flex-row space-x-2">
            <div className="text-xl">Name</div>
            <div className="text-xl">Surname</div>
          </div>
          <div className="">Male</div>
        </div>
        <button className="bg-amber-500 rounded-md text-white p-2 px-5 absolute bottom-4 right-4">
          Edit
        </button>
      </div>
    </main>
  );
};

export default Home;
