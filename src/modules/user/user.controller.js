import { sendSuccess } from "../../utils/ApiResponse.js";
import { deleteUser, getUserById, getUsers, updateUser } from "./user.service.js";

// get users controller
export const getUsersController = async (req, res) => {
    const { users } = await getUsers();
    sendSuccess(res, { data: { users } });
}

// get user by id controller
export const getUserByIdController = async (req, res) => {
    const { user } = await getUserById(req.params.userId);
    sendSuccess(res, { data: { user } });
}

// update user by id controller
export const updateUserController = async (req, res) => {
    const user = await updateUser(req.params.userId, req.body);
    sendSuccess(res, { data: user });
}

// delete user controller
export const deleteUserController = async (req, res) => {
    const user = await deleteUser(req.params.userId);
    sendSuccess(res, { data: user });
}