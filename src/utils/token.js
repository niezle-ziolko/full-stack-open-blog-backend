import jwt from "jsonwebtoken";

export function createToken(username, env) {
  const SECRET_KEY = env.TOKEN;

  return jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
};

export function verifyToken(token, env) {
  try {
    const SECRET_KEY = env.TOKEN;

    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  };
};