import bcrypt from "bcrypt";

export const hashPassword = async ( model ) => {

    const bcryptRegex = /^\$2[ayb]\$.{56}$/;

    if (model.password && !bcryptRegex.test(model.password)) {
        const salt = await bcrypt.genSalt(12);
        model.password = await bcrypt.hash(model.password, salt)
    }

}