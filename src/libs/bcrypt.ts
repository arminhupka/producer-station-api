import * as bcrypt from 'bcryptjs';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const matchPassword = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};
