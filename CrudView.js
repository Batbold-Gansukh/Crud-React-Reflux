'use strict'
var React = require('react')
var CrudList = require('./subView/CrudList')
var CrudNew = require('./subView/CrudNew')
var ModalAlert = require("../components/modal/ModalAlert")
var DateInput = require("../components/input/DateInput")
var Pagination = require("../components/pagination/Pagination")
var Form = require("../components/form/EntityForm")
var Utils = require("../components/utils/Utils")

var CrudView = React.createClass({

  render: function () {
    var type = this.props.type || "from"
    var crud = (function (self) {
      if (type === "from") {
        return React.withContext({
          intRender: self.props.intRender,
          floatRender: self.props.floatRender,
          dateRender: self.props.dateRender || self.dateRender,
          imgRender: self.props.imgRender,
          intEditRender: self.props.intEditRender,
          floatEditRender: self.props.floatEditRender,
          dateEditRender: self.props.dateEditRender,
          imgEditRender: self.props.imgEditRender,
          modalAlert: ModalAlert,
          dateInput: DateInput,
          pagination: Pagination,
          token: self.props.token,
          utils: Utils
        }, function () {
          return <CrudList
            tableName={self.props.tableName}
            tableDescription={self.props.tableDescription}
            columns={self.props.columns}
            from={self.props.from}
            delta={self.props.delta}
            count={self.props.count}
            newAddress={self.props.newLink}
            listAddress={self.props.listLink}
            editAddress={self.props.editLink}
            loadingSpin={self.props.loadingSpin}
            listEntitiesUrl={self.props.listEntitiesUrl}
            updateEntityUrl={self.props.updateEntityUrl}
            deleteEntitiesUrl={self.props.deleteEntitiesUrl}
          />
        })
      } else if (type === "new") {
        return React.withContext({
          modalAlert: ModalAlert,
          dateInput: DateInput,
          dateRender: self.props.dateRender || self.dateRender,
          form: Form,
          token: self.props.token,
          utils: Utils
        }, function () {
          return <CrudNew
            tableName={self.props.tableName}
            tableDescription={self.props.tableDescription}
            columns={self.props.columns}
            listAddress={self.props.listLink}
            from={self.props.from}
            loadingSpin={self.props.loadingSpin}
            createNewUrl={self.props.createNewUrl}
          />
        })
      }
    })(this)
    return (<span>
        {crud}
    </span>)
  }

})

module.exports = CrudView