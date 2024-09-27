import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faDollarSign } from "@fortawesome/free-solid-svg-icons";

const RestaurantCard = ({ restaurant, onClick }) => {
  return (
    <div
      className="flex flex-col justify-start items-start w-full sm:w-72 md:w-80 lg:w-96 max-w-full bg-white rounded-2xl shadow-lg transition-transform duration-300 transform hover:scale-105"
      onClick={onClick}>
      <img
        src={restaurant.image_url}
        className="w-full h-40 sm:h-48 object-cover rounded-t-2xl"
        alt={`${restaurant.name} logo`}
      />

      <div className="flex flex-col justify-start w-full p-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
            {restaurant.name}
          </h1>
          <h1 className="text-lg sm:text-xl font-bold text-gray-600">
            <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
            {restaurant.price}
          </h1>
        </div>

        <div className="flex items-center mb-2">
          <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1" />
          <h1 className="text-lg font-medium text-gray-700">
            {restaurant.rating}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {restaurant.categories.map((category) => (
            <span
              key={category.alias}
              className="bg-red-200 text-red-800 text-sm font-medium py-1 px-2 rounded-full">
              {category.title}
            </span>
          ))}
        </div>

        <h1 className="text-right text-gray-500 text-sm break-words">
          {restaurant.location.address1}
        </h1>
      </div>
    </div>
  );
};

export default RestaurantCard;
