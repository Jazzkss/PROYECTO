import bcrypt from "bcrypt";


export const comparePassHash = async (passwordForm, passwordHashed) => {
    return await bcrypt.compare(passwordForm, passwordHashed);
}