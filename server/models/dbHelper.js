import { getFallbackState } from '../config/db.js';

export const makeFallbackModel = (collectionName, mongooseModel) => {
  // On Vercel (production), we always use MongoDB — no filesystem fallback.
  // This wrapper simply delegates to the Mongoose model.
  return {
    find: async (query = {}) => {
      return mongooseModel.find(query);
    },

    findOne: async (query = {}) => {
      return mongooseModel.findOne(query);
    },

    findById: async (id) => {
      return mongooseModel.findById(id);
    },

    create: async (data) => {
      return mongooseModel.create(data);
    },

    findByIdAndUpdate: async (id, updateData, options = {}) => {
      return mongooseModel.findByIdAndUpdate(id, updateData, options);
    },

    findByIdAndDelete: async (id) => {
      return mongooseModel.findByIdAndDelete(id);
    },

    countDocuments: async (query = {}) => {
      return mongooseModel.countDocuments(query);
    }
  };
};
