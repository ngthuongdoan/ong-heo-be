import httpStatus from 'http-status';
import mongoose, { ObjectId } from 'mongoose';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { userService } from '../services';

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.params.userId);
  const user = await userService.getUserById(userId as ObjectId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.params.userId);
  const user = await userService.updateUserById(userId as ObjectId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.params.userId);
  await userService.deleteUserById(userId as ObjectId);
  res.status(httpStatus.NO_CONTENT).send();
});

export const userController = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
