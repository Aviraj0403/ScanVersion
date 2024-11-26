// const API_URL = "http://localhost:4000/api/food/66f2f1c8f2696a3714a2d1ad"; // Hardcoded food API URL
const API_URL = "https://backend-obet.onrender.com/api/food/66f2f1c8f2696a3714a2d1ad"
const TABLE_API_URL = "https://backend-obet.onrender.com/api/table/66f2f1c8f2696a3714a2d1ad/get-active"; // Hardcoded restaurant ID for table API
const OFFER_API_URL = "https://backend-obet.onrender.com/api/offer/66f2f1c8f2696a3714a2d1ad/get-active"; // Corrected URL

async function fetchData(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Network response was not ok');
  }
  return res.json();
}

// Food API Functions
export async function getMenu() {
  const { data } = await fetchData(`${API_URL}/list-food`);
  return data;
}

export async function getOrder(id) {
  const { data } = await fetchData(`${API_URL}/order/${id}`);
  return data;
}

// export async function createOrder(newOrder) {
//   const { data } = await fetchData(`${API_URL}/order`, {
//     method: "POST",
//     body: JSON.stringify(newOrder),
//     headers: { "Content-Type": "application/json" },
//   });
//   return data;
// }

export async function updateOrder(id, updateObj) {
  await fetchData(`${API_URL}/order/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updateObj),
    headers: { "Content-Type": "application/json" },
  });
}

export const getFoodsByCategoryAndType = async (category, itemType = '') => {
  const { data } = await fetchData(`${API_URL}/category/${category}/${itemType}`);
  return data;
};

// Table API Functions
export async function getDiningTables(status) {
  const url = status ? `${TABLE_API_URL}?status=${status}` : TABLE_API_URL;

  const { data } = await fetchData(url);
  return data;
}

// Example usage to get active dining tables
export const fetchActiveDiningTables = async () => {
  try {
    return await getDiningTables('Active');
  } catch (error) {
    console.error('Failed to fetch active dining tables:', error.message);
  }
};

// Offer API Functions
export async function getOffer(status) {
  const url = status ? `${OFFER_API_URL}?status=${status}` : OFFER_API_URL; // Ensure the status can be appended if needed
  const { data } = await fetchData(url);
  return data;
}

// Fetch Active Offers
export const fetchActiveOffer = async () => {
  try {
    return await getOffer('Active'); // Fetching active offers
  } catch (error) {
    console.error('Failed to fetch active offers:', error.message);
  }
};

// Example usage to fetch offers
fetchActiveOffer();
