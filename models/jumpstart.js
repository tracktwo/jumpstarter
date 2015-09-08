var mongoose = require('mongoose');
var JumpStartSchema = new Mongoose.Schema({
  title: String,
  author: String,
  startDate: String,
  exaltClues: Number,
  alienResources: Number,
  alienResearch: Number,
  xcomThreat: Number,
  slingshotDelay: Number,
  credits: Number,
  fragments: Number,
  alloys: Number,
  elerium: Number,
  scientists: Number,
  engineers: Number,
  meld: Number,

  soldiers: [{
    firstName: String,
    lastName: String,
    nickName: String,
    rank: String,
    class: String,
    gender: String,
    country: String,
    psiRank: String,
    hp: Number,
    aim: Number,
    mobility: Number,
    will: Number,
    attribBonus: Boolean,
    classPerks: [String],
    psiPerks: [String],
    extraPerks: [String]
  }]
});

mongoose.model('JumpStart', JumpStartSchema);