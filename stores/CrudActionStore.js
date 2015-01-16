'use strict'

var Reflux = require('reflux')
var CrudActions = require('../actions/CrudActions')
var $ = require('superagent')

var CrudActionStore = Reflux.createStore({
    createNewUrl:"url is not set",
    init: function () {
        this.listenTo(CrudActions.createNew, this._createNew)
        this.listenTo(CrudActions.updateEntity, this._updateEntity)
    },
    _updateEntity:function(value){
    },
    _createNew:function(values){
        var self = this
        $.post(self.createNewUrl)
            .send(values)
            .end(function(err,res){
                if(res.ok){
                    self.trigger("success")
                }else{
                    self.trigger("error")
                }
            })
    }
})

module.exports = CrudActionStore