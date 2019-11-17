const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors')
const faker = require('faker')

dotenv.config({ path: './config/.env' })

const Game = require('../models/game')

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

const games = JSON.parse(
  fs.readFileSync(`${__dirname}/../public/games.json`, 'utf-8')
)

const deleteData = async () => {
  try {
    await Game.deleteMany()
    console.log('DATA DELETED...'.red.inverse)
    process.exit()
  } catch (error) {
    console.log(error.red)
  }
}

const createData = (games, platform) => {
  return games[platform].map(item => {
    return {
      platform: platform,
      title: item.title,
      description: faker.random.words,
      images: item.images.map(image => {
        return process.env.HOST + ':' + process.env.PORT + '/' + image
      })
    }
  })
}

const importData = async () => {
  try {
    await Game.create(createData(games, 'zx'))
    await Game.create(createData(games, 'nes'))
    await Game.create(createData(games, 'snes'))
    await Game.create(createData(games, 'smd'))

    console.log('DATA IMPORTED...'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(error)
  }
}

if (process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  deleteData()
}