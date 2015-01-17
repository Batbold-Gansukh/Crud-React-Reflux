//var real$ = require.requireActual('superagent')
var $ = {}

$.post = jest.genMockFn().mockReturnThis()
$.send = jest.genMockFn().mockReturnThis()
$.set = jest.genMockFn().mockReturnThis()
$.end = ((cb)=>{

  console.log("callback:"+cb)
  cb({},rows)
})

module.exports = $
