const API_URL = "http://localhost:4000/api"; // Replace with your backend URL

export async function getMenu() {
  const res = await fetch(`${API_URL}/food/list-food`);

  if (!res.ok) throw new Error("Failed to get menu");

  const { data } = await res.json();
  return data;
}

export async function getOrder(id) {
  const res = await fetch(`${API_URL}/order/${id}`);
  if (!res.ok) throw new Error(`Couldn't find order #${id}`);

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

    if (!res.ok) throw new Error("Failed to create your order");

    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create your order");
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

    if (!res.ok) throw new Error("Failed to update your order");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update your order");
  }
}

// Function to get foods by category and type
export const getFoodsByCategoryAndType = async (category, itemType) => {
  try {
    const itemTypePath = itemType ? itemType : ''; // Handle optional itemType
    const response = await fetch(`${API_URL}/food/category/${category}/${itemTypePath}`);
    
    if (!response.ok) {
      throw new Error('Error fetching foods by category and item type');
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching foods by category and item type:', error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};
