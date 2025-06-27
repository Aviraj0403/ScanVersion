// const BASE_API_URL = "https://backend-obet.onrender.com/api";  // Define the base API URL
const BASE_API_URL="https://apitesting.iirhe.org.in/api"

// Function to fetch data from a given URL with dynamic restaurantId
async function fetchData(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Network response was not ok');
  }
  return res.json();
}

// Food API Functions - with dynamic restaurantId
export async function getMenu(restaurantId) {
  const { data } = await fetchData(`${BASE_API_URL}/food/${restaurantId}/list-food`);
  return data;
}

export async function getOrder(restaurantId, id) {
  const { data } = await fetchData(`${BASE_API_URL}/food/${restaurantId}/order/${id}`);
  return data;
}

// Function to update an order
export async function updateOrder(restaurantId, id, updateObj) {
  await fetchData(`${BASE_API_URL}/food/${restaurantId}/order/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updateObj),
    headers: { "Content-Type": "application/json" },
  });
}

// Fetch food items by category and type
export const getFoodsByCategoryAndType = async (restaurantId, category, itemType = '') => {
  const { data } = await fetchData(`${BASE_API_URL}/food/${restaurantId}/category/${category}/${itemType}`);
  return data;
};

// Table API Functions - with dynamic restaurantId
export async function getDiningTables(restaurantId, status) {
  const url = status ? `${BASE_API_URL}/table/${restaurantId}/get-active?status=${status}` : `${BASE_API_URL}/table/${restaurantId}/get-active`;
  const { data } = await fetchData(url);
  return data;
}

// Fetch active dining tables for a restaurant
export const fetchActiveDiningTables = async (restaurantId) => {
  try {
    return await getDiningTables(restaurantId, 'Active');
  } catch (error) {
    console.error('Failed to fetch active dining tables:', error.message);
  }
};

// Offer API Functions - with dynamic restaurantId
export async function getOffer(restaurantId, status) {
  const url = status ? `${BASE_API_URL}/offer/${restaurantId}/get-active?status=${status}` : `${BASE_API_URL}/offer/${restaurantId}/get-active`;
  const { data } = await fetchData(url);
  return data;
}

// Fetch Active Offers for a restaurant
export const fetchActiveOffer = async (restaurantId) => {
  try {
    return await getOffer(restaurantId, 'Active'); // Fetching active offers for the specific restaurant
  } catch (error) {
    console.error('Failed to fetch active offers:', error.message);
  }
};
