export const getShifts = async () => {
  try {
    const response = await fetch("/api/read/shifts");
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return { success: true, shifts: data.shifts };
  } catch (error) {
    console.error("[SHIFT GET ERROR]: ", error);
    return { success: false, message: error.message };
  }
};

export const getUsers = async () => {
  try {
    const response = await fetch("/api/read/users");
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
    return { success: true, users: data.users };
  } catch (error) {
    console.error("[SHIFT GET ERROR]: ", error);
    return { success: false, message: error.message };
  }
};
