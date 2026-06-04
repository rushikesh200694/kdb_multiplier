import fs from 'fs';
import path from 'path';
import { getFallbackState, JSON_DB_PATH } from '../config/db.js';

const readData = () => {
  const data = fs.readFileSync(JSON_DB_PATH, 'utf8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2));
};

export const getCollection = (collectionName) => {
  const data = readData();
  return data[collectionName] || [];
};

export const saveCollection = (collectionName, items) => {
  const data = readData();
  data[collectionName] = items;
  writeData(data);
};

export const makeFallbackModel = (collectionName, mongooseModel) => {
  const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

  return {
    find: async (query = {}) => {
      const fallback = getFallbackState();
      if (!fallback) {
        return mongooseModel.find(query);
      }
      let items = getCollection(collectionName);
      
      // Simple query filter
      return items.filter(item => {
        for (let key in query) {
          if (query[key] !== undefined) {
            // Support regex search
            if (query[key] instanceof RegExp) {
              if (!query[key].test(item[key])) return false;
            } else if (typeof query[key] === 'object' && query[key] !== null) {
              // Handle special operators like $in, $or if needed, or regex object
              if (query[key].$regex) {
                const regexFlags = query[key].$options || '';
                const reg = new RegExp(query[key].$regex, regexFlags);
                if (!reg.test(item[key])) return false;
              }
            } else {
              // Direct match (string representation or exact)
              if (String(item[key]) !== String(query[key])) return false;
            }
          }
        }
        return true;
      });
    },

    findOne: async (query = {}) => {
      const fallback = getFallbackState();
      if (!fallback) {
        return mongooseModel.findOne(query);
      }
      const items = getCollection(collectionName);
      const found = items.find(item => {
        for (let key in query) {
          if (query[key] !== undefined) {
            if (query[key] instanceof RegExp) {
              if (!query[key].test(item[key])) return false;
            } else if (String(item[key]) !== String(query[key])) {
              return false;
            }
          }
        }
        return true;
      });
      return found || null;
    },

    findById: async (id) => {
      const fallback = getFallbackState();
      if (!fallback) {
        return mongooseModel.findById(id);
      }
      const items = getCollection(collectionName);
      const found = items.find(item => String(item._id) === String(id));
      return found || null;
    },

    create: async (data) => {
      const fallback = getFallbackState();
      if (!fallback) {
        return mongooseModel.create(data);
      }
      const items = getCollection(collectionName);
      const newItem = {
        _id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      items.push(newItem);
      saveCollection(collectionName, items);
      return newItem;
    },

    findByIdAndUpdate: async (id, updateData, options = {}) => {
      const fallback = getFallbackState();
      if (!fallback) {
        return mongooseModel.findByIdAndUpdate(id, updateData, options);
      }
      const items = getCollection(collectionName);
      const index = items.findIndex(item => String(item._id) === String(id));
      if (index === -1) return null;
      
      const updatedItem = {
        ...items[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      items[index] = updatedItem;
      saveCollection(collectionName, items);
      return updatedItem;
    },

    findByIdAndDelete: async (id) => {
      const fallback = getFallbackState();
      if (!fallback) {
        return mongooseModel.findByIdAndDelete(id);
      }
      const items = getCollection(collectionName);
      const filtered = items.filter(item => String(item._id) !== String(id));
      saveCollection(collectionName, filtered);
      return { _id: id };
    },

    countDocuments: async (query = {}) => {
      const fallback = getFallbackState();
      if (!fallback) {
        return mongooseModel.countDocuments(query);
      }
      const items = getCollection(collectionName);
      return items.length;
    }
  };
};
