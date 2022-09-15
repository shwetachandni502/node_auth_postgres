import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const { JWT_SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { email, password } = req.body;
    const userFound = await db.Users.findOne({ email });
    if (!userFound) throw new httpErrors.BadRequest('Invalid credentials');
    const match = await bcrypt.compare(password, userFound.password);
    if (!match) throw new httpErrors.BadRequest('Invalid credentials');
    jwt.sign(
      {
        sub: userFound.id,
        userName: userFound.full_name,
      },
      JWT_SECRET_KEY,
      (err, token) => {
        if (err) throw new httpErrors.InternalServerError();
        return res.json({
          success: true,
          token,
          user: userFound,
          message: 'Logged in successfully',
        });
      }
    );
}

const createUser = async (req, res) => {
  try {
		const { full_name, email, password } = req.body;
		const existingUser = await db.Users.findOne({ where: { email: email } });
		if (existingUser) {
			return res.status(500).json({
				message: 'User already exist',
        success: false,
			});
		}
		try {
			const newUser = await db.Users.create({
				fullName: full_name,
        email: email,
        password: bcrypt.hashSync(password, 8),
			});
			var tokenUser = jwt.sign(
				{
					tokenUser: {
						userData: newUser
					}
				},
				JWT_SECRET_KEY
			);
			res.status(200).send({
				accessToken: tokenUser,
        newUser,
				message: 'User Created successfully.',
			})
		} catch (err) {
			console.log("err", err);

		}

	} catch (error) {
		console.log("error", error);
		res.status(200).json({ status: true, error: error });
	}

}

const getAllUser = async (req, res) => {
  try {
		const users = await db.Users.find();
    return res.json({ users, success: true });
	} catch (error) {
		res.status(400).json({ status: true, error: error });
	}
}

export default { login, createUser, getAllUser };
