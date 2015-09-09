var mongoose = require('mongoose');
var JumpStartSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  author: { type: String, default: "" },
  startDate: { type: String, default: "" },
  exaltClues: { type: Number, default: -1 },
  alienResources: { type: Number, default: -1 },
  alienResearch: { type: Number, default: -1 },
  xcomThreat: { type: Number, default: -1 },
  slingshotDelay: { type: Number, default: -1 },
  credits: { type: Number, default: -1 },
  fragments: { type: Number, default: -1 },
  alloys: { type: Number, default: -1 },
  elerium: { type: Number, default: -1 },
  scientists: { type: Number, default: -1 },
  engineers: { type: Number, default: -1 },
  meld: { type: Number, default: -1 },

  soldiers: [{
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    nickName: { type: String, default: "" },
    rank: { type: String, default: "PFC" },
    class: {type: String, default: "None" },
    gender: { type: String, default: "" },
    country: { type: String, default: "" },
    psiRank: { type: String, default: "None" },
    hp: { type: Number, default: 0 },
    aim: { type: Number, default: 0 },
    mobility: { type: Number, default: 0 },
    will: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    attribBonus: { type: Boolean, default: true },
    classPerks: [String],
    psiPerks: [String],
    extraPerks: [String]
  }],

  research: [String],
  foundry: [String],
  ots: [String]
});

mongoose.model('JumpStart', JumpStartSchema);