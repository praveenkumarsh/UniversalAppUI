export default function Header() {
    return (
      <header className="p-4 flex justify-between items-center shadow w-full bg-emerald-500">
        <h1 className="text-2xl font-bold text-white">Universal System</h1>
        <div className="flex items-center space-x-4">
          <img
            src="https://thispersondoesnotexist.com"
            alt="User Profile"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
        </div>
      </header>
    );
  }
  