import * as mongoose from 'mongoose';


export const LocaleSchema = new mongoose.Schema({
  cityId: {
    type: Number,
    unique: true
  },
  cityName: String,
  state: String
}, {collection: 'locale'})