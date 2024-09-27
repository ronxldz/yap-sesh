import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full min-h-screen bg-red-200 gap-8 p-4">
        <div className="flex flex-col items-center sm:flex-row justify-center w-full gap-8 sm:gap-12">
          <img
            className="w-32 h-32 sm:w-48 sm:h-48" // Adjust size for mobile and larger screens
            src="/assets/cook.svg"
            alt="logo"
          />
          <h1 className="text-5xl sm:text-8xl font-black text-white uppercase">
            Yums
          </h1>
        </div>

        <button
          className="px-12 py-3 sm:px-24 sm:py-4 bg-white rounded-full shadow-sm transition-shadow duration-300 hover:shadow-lg"
          onClick={() => navigate("/choose")}>
          <h1 className="text-xl sm:text-2xl font-bold text-red-300 uppercase">
            Play
          </h1>
        </button>
      </div>
    </>
  );
}

export default Home;
