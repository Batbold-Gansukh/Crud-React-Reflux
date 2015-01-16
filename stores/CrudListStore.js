'use strict'

var Reflux = require('reflux')
var crudActions = require('../actions/CrudActions')
var $ = require('superagent')

var CrudListStore = Reflux.createStore({

  listEntitiesUrl: "url is not set",
  updateEntityUrl: "url is not set",
  deleteEntitiesUrl: "url is not set",

  init: function () {
    this.listenTo(crudActions.loadEntities, this._loadBets)
    this.listenTo(crudActions.commitUpdate, this._commitUpdateBet)
    this.listenTo(crudActions.selectEntity, this._createBet)
    this.listenTo(crudActions.selectAllEntity, this._deleteBet)
    this.listenTo(crudActions.deleteEntities, this._deleteEntities)
  },
  entityList: {},
  allSize: undefined,
  _deleteBet: function (value) {
    var self = this
    Object.keys(this.entityList).map(function (key) {
      self.entityList[key].selected = value
    })
    this.trigger(this.entityList, this.allSize)
  },
  _createBet: function (id, value) {
    this.entityList[id].selected = value
    this.trigger(this.entityList, this.allSize)
  },
  _indexList: function (rows) {
    var result = {}
    rows.map(function (row) {
      result[row.ID] = row
    })
    return result
  },
  _refreshList: function (res) {
    if (res.body === undefined || res.body === null) {
      res.body = {list: {}, size: 0}
    }
    this.entityList = this._indexList(res.body.list)
    this.allSize = res.body.size
    this.trigger(this.entityList, this.allSize, false)
  },
  _loadBets: function (tableName, fromE, count, search, token) {
    var self = this
    var searchPattern = (function () {
      var s = search
      if (s === undefined || s === null || s.length === 0)
        return null
      return s
    })()
    $.post(self.listEntitiesUrl)
      .set('X-Auth-Token', token)
      .send({name: tableName, from: fromE, count: count, search: searchPattern})
      .end(function (error, result) {
        self._refreshList(result)
      })
  },
  _commitUpdateBet: function (tableName, columnName, id, updateValue, fromE, count, search, columnType, token) {
    console.log("Instore commit update test:")
    var self = this
    $.post(self.updateEntityUrl)
      .set('X-Auth-Token', token)
      .send({
        name: tableName, column: columnName, id: id, update: updateValue,
        from: fromE, count: count, search: search, type: columnType
      })
      .end(function (error, result) {
        self._loadBets(tableName, fromE, count, search, token)
      })
  },
  _deleteEntities: function (tableName, ids, fromE, count, search, token) {
    var self = this
    console.log("delete:" + search)
    $.post(self.deleteEntitiesUrl)
      .set('X-Auth-Token', token)
      .send({name: tableName, ids: ids, from: fromE, count: count, search: search})
      .end(function (error, result) {
        self._loadBets(tableName, fromE, count, search, token)
      })
  }
})

module.exports = CrudListStore
