import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/auth.model.js";

export const getUsers = async () => {
    const users = await User.findAll();
    return { users };
}

export const getUserById = async (userId) => {
    const user = await User.findByPk(userId);

    if (!user) throw ApiError.notFound('User not found');

    return {
        user: {
            fullName: user.fullName, email: user.email, role: user.role, mobileNumber: user.mobileNumber
        }
    }
}

export const updateUser = async (userId, payload) => {
    const user = await User.findByPk(userId);

    if (!user) throw ApiError.notFound('User not found');

    await user.update(payload);
}

export const deleteUser = async (userId) => {
    const user = await User.findByPk(userId);

    if (!user) throw ApiError.notFound('User not found');

    await user.update({
        isActive: false
    }, {
        where: { userId }
    });
}