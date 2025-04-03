export async function getAddress(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch address !");
    }

    if (data && data.display_name) {
      return data.display_name;
    } else {
      return "Không tìm thấy địa chỉ";
    }
  } catch (error) {
    console.error("Lỗi khi lấy địa chỉ:", error);
    return "Lỗi khi lấy địa chỉ";
  }
}
