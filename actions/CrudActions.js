'use strict'

var Reflux = require('reflux')

var CrudActions = Reflux.createActions([
    "loadEntities",
    "commitUpdate",
    "createNew",
    "statusInfo",
    "deleteEntities",
    "selectEntity",
    "selectAllEntity",
    "updateEntity",
])

module.exports = CrudActions