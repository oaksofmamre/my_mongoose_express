"use strict";

var faker = require("faker");
var voca = require("voca");
const mongoose = require("mongoose");
const models = require("../models");
var env = process.env.NODE_ENV || "development";
var config = require("../config/mongo")[env];
const mongooseeder = require("mongooseeder");

const { User, Ratable, Rating, Hotel, Motel } = models;

const MULTIPLIER = 1;

function randomRating() {
  return Math.floor(Math.random() * 6);
}

function randomLodgingName(type) {
  type = voca.titleCase(type);
  var randomWord = faker.random.word();
  randomWord = voca.titleCase(randomWord);
  var names = [
    `The ${randomWord} Inn`,
    `${type} ${randomWord}`,
    `${randomWord} ${type}`
  ];
  var index = Math.floor(Math.random() * names.length);
  return names[index];
}

const seeds = () => {
  // ----------------------------------------
  // Create Users
  // ----------------------------------------
  console.log("Creating Users");
  var users = [];
  for (let i = 0; i < MULTIPLIER * 2; i++) {
    var user = new User({
      fname: "Foo",
      lname: "Bar",
      username: `foobar${i}`,
      email: `foobar${i}@gmail.com`
    });
    users.push(user);
  }

  // ----------------------------------------
  // Hotels
  // ----------------------------------------
  console.log("Creating Hotels");
  var hotels = [];
  for (let i = 0; i < MULTIPLIER * 100; i++) {
    var hotel = new Hotel({
      name: randomLodgingName("hotel")
    });
    hotels.push(hotel);
  }

  // ----------------------------------------
  // Motels
  // ----------------------------------------
  console.log("Creating Motels");
  var motels = [];
  for (let i = 0; i < MULTIPLIER * 100; i++) {
    var motel = new Motel({
      name: randomLodgingName("motel")
    });
    motels.push(motel);
  }

  // ----------------------------------------
  // Ratings
  // ----------------------------------------
  console.log("Creating Ratings");
  var ratings = [];
  for (let i = 0; i < MULTIPLIER * 1000; i++) {
    var hotel = hotels[i % hotels.length];
    var motel = motels[i % motels.length];
    var user = users[1];
    var hotelRating = new Rating({
      ratable: hotel,
      user: user,
      value: randomRating()
    });
    var motelRating = new Rating({
      ratable: motel,
      user: user,
      value: randomRating()
    });
    hotel.ratings.push(hotelRating);
    motel.ratings.push(motelRating);
    ratings.push(hotelRating);
    ratings.push(motelRating);
  }

  // ----------------------------------------
  // Finish
  // ----------------------------------------
  console.log("Saving...");
  var promises = [];
  [users, hotels, motels, ratings].forEach(collection => {
    collection.forEach(model => {
      promises.push(model.save());
    });
  });
  return Promise.all(promises);
};

// Always use the MongoDB URL to allow
// easy connection in all environments
const mongodbUrl =
  process.env.NODE_ENV === "production"
    ? process.env[config.use_env_variable]
    : `mongodb://${config.host}/${config.database}`;

console.log("////////////////////////");
console.log(mongodbUrl);
console.log("////////////////////////");

mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  seeds: seeds,
  clean: true,
  models: models,
  mongoose: mongoose
});

// mongooseeder.clean({
//   database: config.database,
//   host: config.host,
//   models: models,
//   mongoose: mongoose
// });
