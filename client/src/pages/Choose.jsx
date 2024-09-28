import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import RestaurantCard from "../components/RestaurantCard";

// Function to shuffle the array (Fisher-Yates Shuffle Algorithm)
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

// Cities list
const cities = ["Atlanta", "Sandy Springs", "Duluth", "Alpharetta", "Marietta"];

function Choose() {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [clickCount, setClickCount] = useState(0); // Track number of clicks

  // Function to get a random city
  function getRandomCity() {
    return cities[Math.floor(Math.random() * cities.length)];
  }

  // Fetch 12 unique restaurants from random cities and shuffle them
  const fetchRestaurants = async () => {
    const categories =
      "italian,french,steakhouses,seafood,winebars,mediterranean,cocktailbars,nightlife,mexican,pizza,korean,japanese";
    const limit = 50;
    let allRestaurants = [];

    // Fetch restaurants from all cities
    for (let i = 0; i < cities.length; i++) {
      const city = getRandomCity();
      const apiUrl = `${
        process.env.REACT_APP_API_URL
      }/api/yelp?location=${encodeURIComponent(
        city
      )}&categories=${encodeURIComponent(categories)}&limit=${limit}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Network error: ${response.status}`);

        const data = await response.json();
        const restaurantData = data.businesses || [];

        // Add to the overall restaurant pool
        allRestaurants = [...allRestaurants, ...restaurantData];
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("Failed to fetch restaurants. Please try again later.");
      }
    }

    // Shuffle and take 12 unique restaurants
    const shuffledRestaurants = shuffleArray(allRestaurants).slice(0, 12);
    setRestaurants(shuffledRestaurants);
    setLoading(false);
  };

  // Handle click and remove one restaurant at a time
  const handleClick = (index) => {
    if (restaurants.length > 1) {
      setRestaurants((prevRestaurants) => {
        const updatedRestaurants = [...prevRestaurants];
        updatedRestaurants.splice(index === 0 ? restaurants.length - 1 : 0, 1); // Remove the unclicked restaurant
        return updatedRestaurants;
      });
      setClickCount((prevCount) => prevCount + 1); // Increment click count
    }
  };

  useEffect(() => {
    fetchRestaurants(); // Fetch 12 unique restaurants when the component mounts
  }, []);

  const redirect = (url) => {
    window.open(url, "_blank");
  };

  if (loading) {
    return <div>Loading...</div>; // Add a loading indicator
  }

  if (error) {
    return <div className="error-message">{error}</div>; // Display error message
  }

  if (restaurants.length === 0) {
    return <div>No restaurants found.</div>; // Display no results message
  }

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-red-200 gap-8 p-4">
      {restaurants.length > 1 ? (
        <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-8 sm:gap-16">
          <RestaurantCard
            restaurant={restaurants[0]}
            onClick={() => {
              handleClick(0); // Handle click for first restaurant
            }}
          />
          <h1 className="text-4xl font-black text-white">OR</h1>
          <RestaurantCard
            restaurant={restaurants[restaurants.length - 1]}
            onClick={() => {
              handleClick(restaurants.length - 1); // Handle click for last restaurant
            }}
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
              onClick={() => {
                redirect(restaurants[0].url); // Redirect to the winner's page
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Choose;
