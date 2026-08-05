import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../../models/auth.model.js"
import { ApiError } from "../../utils/ApiError.js";
import env from "../../config/env.js";
import { Op } from "sequelize";

function signAccessToken(user) {
    return jwt.sign(
        { sub: user.userId, role: user.role, teamId: user.TeamID || null },
        env.JWT_ACCESS_SECRET,
        { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
    );
}

function signRefreshToken(user) {
    return jwt.sign({ sub: user.userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
}

export const login = async (email, password) => {
    const user = await User.findOne({ where: { email } });

    if (!user || !user.isActive) throw ApiError.unauthorized('Invalid credentials');

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
        throw ApiError.unauthorized('Invalid credentials');
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return {
        accessToken,
        refreshToken,
        user: { fullName: user.fullName, email: user.email, role: user.role }
    }
}

export const register = async (payload) => {
    const user = await User.findOne({
        where: {
            [Op.or]: [
                { email: payload.email },
                { mobileNumber: payload.mobileNumber }
            ]
        }
    });

    if (user?.email == payload.email) throw ApiError.conflict('email already exists');
    if (user?.mobileNumber == payload.mobileNumber) throw ApiError.conflict('Mobile Number already exists');

    const passwordHash = await bcrypt.hash(payload.password, 12);

    const newUser = await User.create({ ...payload, passwordHash });

    const accessToken = signAccessToken(newUser);
    const refreshToken = signRefreshToken(newUser);

    return {
        accessToken,
        refreshToken,
        user: { fullName: newUser.fullName, email: newUser.email, role: newUser.role }
    }
}

export const refresh = async (refreshToken) => {
    let payload;
    try {
        payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    } catch {
        throw ApiError.unauthorized('Invalid or expired refresh token');
    }
    
    const user = await User.findByPk(payload.sub);

    if (!user || !user.isActive) throw ApiError.unauthorized('User does not exist');

    const accessToken = signAccessToken(user);

    return { accessToken }
}