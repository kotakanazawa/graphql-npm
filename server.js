const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const schema = buildSchema(`
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Query {
    getDie(numSides: Int): RandomDie
  }
`)

class RandomDie {
  constructor(numSides) {
    this.numSides = numSides
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides)
  }

  roll({numRolls}) {
    let output = []
    for(var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce())
    }
    return output
  }
}

const root = {
  getDie: ({numSides}) => {
    return new RandomDie(numSides || 6)
  }
}

const app = express()
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}))

app.listen(4000)
console.log('Running a GraphQL API sever...')
