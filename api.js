const environment = process.argv.length >= 3 ? process.argv[2] : 'production';
module.exports.environment = environment
const config = require(`./config.${environment}.json`)

const express = require('express')
const router = express.Router()
const patreon = require('./patreon')
const common = require('./utils/common')
const Application = require('./models/Application')

module.exports.router = router

router.use('/patreon', require('./api/patreon').router)
router.use('/bump', require('./api/bump').router)

async function blockScopeMissing(res, scope) {
  res.status(403)
  res.json({ stats: 403, message: `Scope${scope.join && scope.length >= 2 ? 's' : ''} \`${scope.join ? scope.join(' ') : scope}\` missing` })
}

async function checkAccess(req, res, next) {
  const regex = /^Bearer ([0-9a-f]{0,})$/gm;
  let m;

  let headers = req.headers
  if(headers['authorization']) {
    let authorization = headers['authorization']

    let token = null

    while ((m = regex.exec(authorization)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        if(groupIndex === 1) token = match
      })
    }

    token = common.toObjectId(token)

    if(token) {
      let application = await Application.findOne({ token: token })
      if(application) {
        req.application = application
        return next()
      }
    }
  }

  res.status(403)
  res.json({ status: 403, message: 'Authorization failed' })
}
