import {UserInterface} from "../../modules/db/interfaces/user";
import {userModel} from "../../modules/db/models/user";
import * as bcrypt from 'bcrypt';
import * as uuid4 from 'uuid/v4';
import * as jwt from 'jsonwebtoken';
import { omit } from 'lodash';
import {Mailer} from "../../modules/mailer";

export class User {
    private static userControllerInstance:User;

    static getInstance() {
        if (!User.userControllerInstance) {
            User.userControllerInstance = new User();
        }
        return User.userControllerInstance;
    }

    private constructor() {}

    saveUser = async (request, reply) => {
        const user: UserInterface & {password: string, token: string} = request.body;
        const isUserAlreadyExists = await userModel.findOne({email: user.email});

        if (isUserAlreadyExists) {
            reply.code(500).send({
                message: `User with email: ${user.email} already exists`,
                status: 'fail',
            });

            return;
        }

        //TODO: Validate;
        const { password = '' } = user;
        user.hash = await bcrypt.hash(password, Number(process.env.saltRounds));
        user.token = uuid4();
        user.validated = false;

        const newUser = new userModel(user);
        const result = await newUser.save();

        await Mailer.getInstance().sendEmail(user.email, user.token);

        reply.code(200).send({
            message: `On your email: ${result.email} was send validation code. Please, check it!`,
            status: 'ok',
        });
    };

    validateUser = async (request, reply) => {
        const { token } = request.params;

        const currentUser = await userModel.findOne({token});
        if (currentUser) {
            await userModel.findOneAndUpdate({_id: currentUser._id}, {
                validated: true,
                $unset: {
                    token: ''
                }
            });

            reply.code(200).send({
                validation: 'success',
                email: currentUser.email,
                token
            });
        } else {
            reply.code(500).send({
                validation: 'fails',
                message: 'token not found'
            });
        }
    };

    authUser = async (request, reply) => {
        const {email, password} = request.body;
        console.log('REQ BODY >>> ', request.body);
        if (!email || !password) {
            reply.code(500).send({
                message: 'Email and password should be passed'
            });

            return;
        }

        const currentUser = await userModel.findOne({email});

        if (currentUser) {
            if (!currentUser.validated) {
                reply.code(500).send({
                    message: 'Need to validate user, please check your email'
                });

                return;
            }

            const isPasswordValid = await bcrypt.compare(password, currentUser.hash);

            if (isPasswordValid) {
                const token = jwt.sign({ id: currentUser._id }, process.env.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });

                reply.code(200).send({
                    token,
                    user: {
                        _id: currentUser._id,
                        email: currentUser.email,
                        firstName: currentUser.firstName,
                        lastName: currentUser.lastName,
                        phone: currentUser.phone,
                    }
                });
            } else {
                reply.code(500).send({
                    message: 'Email or password incorrect'
                });
            }

        } else {
            reply.code(500).send({
                message: 'Email or password incorrect'
            });
        }
    };

    verifyUserIds = (headersToken: string, userId: string): boolean => {
        try {
            const decoded = jwt.verify(headersToken, process.env.secret);
            return decoded.id === userId;
        } catch (err) {
            return false;
        }
    };

    tokenVerificationHook = async (request, reply, next) => {
        console.log('BEFORE HOOK CALLED');
        const token = request.headers['x-access-token'];
        const { user } = request.body;
        if (!this.verifyUserIds(token, user._id)) {
            reply.code(500).send({
                message: 'Something went wrong. Please, login again',
            });
        } else {
            next();
        }
    };

    updateUser = async (request, reply) => {
        const { user } = request.body;
        const updatedUser = await userModel.findOneAndUpdate({_id: user._id}, user);

        reply.code(200).send({
            user: updatedUser
        });
    }
}
