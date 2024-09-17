const API_URL = "http://localhost:4000/api"; // Replace with your backend URL

export async function getMenu() {
  const res = await fetch(`${API_URL}/food/list-food`); // Update endpoint as needed

  if (!res.ok) throw Error("Failed getting menu");

  const { data } = await res.json();
  return data;
}

export async function getOrder(id) {
  const res = await fetch(`${API_URL}/order/${id}`);
  if (!res.ok) throw Error(`Couldn't find order #${id}`);

  const { data } = await res.json();
  return data;
}

export async function createOrder(newOrder) {
  try {
    const res = await fetch(`${API_URL}/order`, {
      method: "POST",
      body: JSON.stringify(newOrder),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw Error();
    const { data } = await res.json();
    return data;
  } catch {
    throw Error("Failed creating your order");
  }
}

export async function updateOrder(id, updateObj) {
  try {
    const res = await fetch(`${API_URL}/order/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updateObj),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw Error();
  } catch (err) {
    throw Error("Failed updating your order");
  }
}
// Add this function to your apiRestaurant.js
// services/apiRestaurant.js
export const getFoodsByCategory = async (category) => {
  try {
    const response = await fetch(`${API_URL}/food/category/${category}`);
    if (!response.ok) {
      throw new Error('Error fetching foods by category');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching foods by category:', error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};
