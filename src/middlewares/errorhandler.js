// 404 error for undefined paths
const invalidPathHandler = (req,res,next) => {
  res.status(404)
  res.json({error:'invalid path'});
}

module.exports = [
  invalidPathHandler,
]
