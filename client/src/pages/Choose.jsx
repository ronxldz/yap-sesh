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

// Cities list to randomize each time
const cities = ["Atlanta", "Sandy Springs", "Duluth", "Alpharetta", "Marietta"];

function Choose() {
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [displayedIds, setDisplayedIds] = useState(new Set()); // Track displayed restaurant IDs

  // Function to get a random city from the cities array
  function getRandomCity() {
    return cities[Math.floor(Math.random() * cities.length)];
  }

  // Fetch restaurants from a specific city
  const fetchRestaurantsFromCity = async (city) => {
    const categories =
      "italian,french,steakhouses,seafood,winebars,mediterranean,cocktailbars,nightlife,mexican,pizza,korean,japanese";
    const limit = 50;

    try {
      const apiUrl = `${
        process.env.REACT_APP_API_URL
      }/api/yelp?location=${encodeURIComponent(
        city
      )}&categories=${encodeURIComponent(categories)}&limit=${limit}`;

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Network error: ${response.status}`);

      const data = await response.json();
      const restaurantData = data.businesses || [];
      return restaurantData;
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setError("Failed to fetch restaurants. Please try again later.");
      return [];
    }
  };

  // Initial fetch to populate the restaurants list
  const fetchInitialRestaurants = async () => {
    setLoading(true);
    const city = getRandomCity();
    const initialRestaurants = await fetchRestaurantsFromCity(city);

    // Shuffle and limit to 20 unique restaurants
    const uniqueRestaurants = initialRestaurants.filter(
      (restaurant) => !displayedIds.has(restaurant.id)
    );

    const shuffledRestaurants = shuffleArray(uniqueRestaurants).slice(0, 20);
    setRestaurants(shuffledRestaurants);
    setLoading(false);

    // Add the new restaurant IDs to displayedIds
    shuffledRestaurants.forEach((restaurant) =>
      displayedIds.add(restaurant.id)
    );
  };

  // Fetch a new restaurant from a random city and replace the unclicked restaurant
  const replaceUnclickedRestaurant = async (clickedIndex) => {
    const newCity = getRandomCity();
    const newRestaurants = await fetchRestaurantsFromCity(newCity);

    // Filter out any restaurants that have already been displayed
    const uniqueNewRestaurants = newRestaurants.filter(
      (restaurant) => !displayedIds.has(restaurant.id)
    );

    if (uniqueNewRestaurants.length > 0) {
      const newRestaurant = uniqueNewRestaurants[0]; // Grab the first unique restaurant

      // Determine the opposite restaurant to replace
      const oppositeIndex = clickedIndex === 0 ? restaurants.length - 1 : 0;

      setRestaurants((prevRestaurants) => {
        const updatedRestaurants = [...prevRestaurants];
        updatedRestaurants[oppositeIndex] = newRestaurant; // Replace the unclicked restaurant
        return updatedRestaurants;
      });

      // Add the new restaurant ID to displayedIds
      displayedIds.add(newRestaurant.id);
    } else {
      console.log("No unique restaurants found in the new city.");
    }
  };

  useEffect(() => {
    fetchInitialRestaurants(); // Fetch initial restaurants when component mounts
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
              replaceUnclickedRestaurant(0); // Replace the unclicked restaurant
            }}
          />
          <h1 className="text-4xl font-black text-white">OR</h1>
          <RestaurantCard
            restaurant={restaurants[restaurants.length - 1]}
            onClick={() => {
              replaceUnclickedRestaurant(restaurants.length - 1); // Replace the unclicked restaurant
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
                redirect(restaurants[0].url);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Choose;
