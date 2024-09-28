const API_URL =  "http://localhost:4000/api/food/66f2f1c8f2696a3714a2d1ad";

async function fetchData(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Network response was not ok');
  }
  return res.json();
}

export async function getMenu() {
  const { data } = await fetchData(`${API_URL}/list-food`);
  return data;
}

export async function getOrder(id) {
  const { data } = await fetchData(`${API_URL}/order/${id}`);
  return data;
}

export async function createOrder(newOrder) {
  const { data } = await fetchData(`${API_URL}/order`, {
    method: "POST",
    body: JSON.stringify(newOrder),
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

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
