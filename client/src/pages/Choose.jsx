import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import RestaurantCard from "../components/RestaurantCard";

const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

const cities = [
  "Atlanta",
  "Sandy Springs",
  "Duluth",
  "Alpharetta",
  "Lawrenceville",
  "Suwanee",
  "Johns Creek",
  "Norcross",
  "Doraville",
  "Chamblee",
];

function Choose() {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [, setClickCount] = useState(0);
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    // RESTAURANTS MODE (comment out when using cafes)
    // const categories =
    //   "italian,french,steakhouses,seafood,winebars,mediterranean,cocktailbars,nightlife,mexican,pizza,korean,japanese";

    // CAFES / MATCHA MODE (comment out when using restaurants)
    const categories = "coffee,cafes,tea";

    const limit = 5;

    const shuffledCities = shuffleArray([...cities]).slice(0, 6);

    const fetchPromises = shuffledCities.map((city) => {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/yelp?location=${encodeURIComponent(city)}&categories=${encodeURIComponent(categories)}&limit=${limit}`;
      return fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => data.businesses || [])
        .catch(() => []);
    });

    const results = await Promise.all(fetchPromises);
    const allRestaurants = results.flat();

    // MATCHA FILTER (only active in cafes mode, comment out for restaurants mode)
    const matchaKeywords = [
      "matcha",
      "tea",
      "cafe",
      "coffee",
      "boba",
      "japanese",
    ];
    const filteredRestaurants = allRestaurants.filter((restaurant) => {
      const name = restaurant.name.toLowerCase();
      const cats = restaurant.categories.map((c) => c.alias).join(" ");
      return matchaKeywords.some(
        (keyword) => name.includes(keyword) || cats.includes(keyword),
      );
    });

    // RESTAURANTS MODE: swap filteredRestaurants -> allRestaurants
    if (filteredRestaurants.length === 0) {
      setError("Failed to fetch restaurants. Please try again later.");
    } else {
      const shuffled = shuffleArray(filteredRestaurants).slice(0, 12);
      setRestaurants(shuffled);
    }
    setLoading(false);
  };

  const handleClick = (index) => {
    if (restaurants.length > 1) {
      setRestaurants((prevRestaurants) => {
        const updatedRestaurants = [...prevRestaurants];
        updatedRestaurants.splice(index === 0 ? restaurants.length - 1 : 0, 1);
        return updatedRestaurants;
      });
      setClickCount((prevCount) => prevCount + 1);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const redirect = (url) => {
    window.open(url, "_blank");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center w-full min-h-screen bg-red-200">
        <h1 className="text-4xl font-black text-white animate-pulse">
          Finding restaurants...
        </h1>
      </div>
    );
  if (error) return <div className="error-message">{error}</div>;
  if (restaurants.length === 0) return <div>No restaurants found.</div>;

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-red-200 gap-8 p-4">
      {restaurants.length > 1 ? (
        <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-8 sm:gap-16">
          <RestaurantCard
            restaurant={restaurants[0]}
            onClick={() => handleClick(0)}
          />
          <h1 className="text-4xl font-black text-white">OR</h1>
          <RestaurantCard
            restaurant={restaurants[restaurants.length - 1]}
            onClick={() => handleClick(restaurants.length - 1)}
          />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-full gap-12">
          <Confetti />
          <h1 className="text-6xl font-black text-white animate-bounce">
            Winner!
          </h1>
          <div className="flex justify-center items-center w-full">
            <RestaurantCard
              restaurant={restaurants[0]}
              onClick={() => redirect(restaurants[0].url)}
            />
          </div>
          <button
            className="px-24 py-4 bg-white text-2xl font-bold text-red-300 rounded-full shadow-sm transition-shadow duration-300 hover:shadow-lg"
            onClick={() => navigate("/")}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default Choose;
