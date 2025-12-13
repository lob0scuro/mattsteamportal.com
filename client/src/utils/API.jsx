//
//  GET
//
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

export const getSchedules = async () => {
  try {
    const response = await fetch("/api/read/schedules");
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return { success: true, schedules: data.schedules };
  } catch (error) {
    console.error("[SCHEDULE QUERY ERROR]: ", error);
    return { success: false, message: error.message };
  }
};

//
//  DELETE
//
const DELETE_HEADERS = {
  method: "DELETE",
  credentials: "include",
};

export const deleteShift = async (id) => {
  try {
    const response = await fetch(`/api/delete/shift/${id}`, DELETE_HEADERS);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return { success: true, message: data.message };
  } catch (error) {
    console.error("[SHIFT DELETION ERROR]: ", error);
    return { success: false, message: error.message };
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`/api/delete/user/${id}`, DELETE_HEADERS);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return { success: true, message: data.message };
  } catch (error) {
    console.error("[USER DELETION ERROR]: ", error);
    return { success: false, message: error.message };
  }
};

//
//  UPDATE
//

//
//  CREATE
//
