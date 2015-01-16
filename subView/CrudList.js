'use strict'

var React = require('react')
var CrudActions = require('../actions/CrudActions')
var CrudListStore = require('../stores/CrudListStore')
var CrudActionStore = require('../stores/CrudActionStore')
//var Router = require('react-router')
//var Link = Router.Link
//var Navigation = Router.Navigation
var TableBody = require("./subList/TableBody")
var TableLoading = require("./subList/TableLoading")

var CrudList = React.createClass({
  //mixins: [Router.State, Navigation],
  getInitialState: function () {
    return {rows: {}, loading: false, selectAll: false, search: ""}
  },
  componentDidMount: function () {
    CrudListStore.listEntitiesUrl = this.props.listEntitiesUrl
    CrudListStore.updateEntityUrl = this.props.updateEntityUrl
    CrudListStore.deleteEntitiesUrl = this.props.deleteEntitiesUrl
    this.unsubscribe = CrudListStore.listen(this._update)
    this.state.from = this.props.from
    this._loadEntities()
  },
  componentWillUnmount: function () {
    this.unsubscribe()
  },

  //componentWillReceiveProps: function () {
  //  this.state.from = this.getParams().efrom
  //  this._loadEntities()
  //},
  _loadEntities: function () {
    var listFrom = this.context.utils.toInt(this.state.from)
    CrudActions.loadEntities(this.props.tableName, listFrom, this.props.count, this.state.search, this.context.token)
    this.state.loading = true
    this.setState(this.state)
  },
  _update: function (rows, size, selectAll) {
    this.state.loading = false
    this.state.rows = rows
    this.state.size = size
    if (selectAll !== undefined)
      this.state.selectAll = selectAll
    var paginationSize = this.context.utils.toInt(this.context.utils.paginationSize(size, this.props.count))
    if (paginationSize < this.props.from) {
      this.transitionTo(this.props.listAddress, {efrom: paginationSize})
    } else {
      this.setState(this.state)
    }
  },
  _selectAll: function (evt) {
    this.state.selectAll = evt.target.checked
    CrudActions.selectAllEntity(this.state.selectAll, this.context.token)
  },
  _getSelectedIds: function () {
    var rows = this.state.rows
    var ids = []
    Object.keys(rows).map(function (key) {
      if (rows[key].selected === true)
        ids.push(rows[key].ID)
    })
    return ids
  },
  _getDeleteSelectedText: function () {
    var ids = this._getSelectedIds()
    if (ids.length === 0) return " "
    return "(" + ids.length + ")"
  },
  _deleteEntities: function () {
    if (this._getSelectedIds().length === 0) return;
    if (confirm(this._getDeleteSelectedText() + (this.props.deleteAskMsg||" ширхэг өгөгдлийг устгах уу?"))) {
      CrudActions.deleteEntities(this.props.tableName, this._getSelectedIds(),
        this.context.utils.toInt(this.props.from), this.props.count, this.state.search, this.context.token)
    }
  },
  _search: function (evt) {
    if (evt.which === 13) {
      this.state.search = evt.target.value
      this._loadEntities()
    }
  },
  contextTypes: {
    pagination: React.PropTypes.func.isRequired,
    token: React.PropTypes.string,
    utils: React.PropTypes.object.isRequired
  },
  propTypes:{
    columns: React.PropTypes.object.isRequired,
    loadingSpin: React.PropTypes.string.isRequired,
    tableName: React.PropTypes.string.isRequired,
    from: React.PropTypes.string.isRequired,
    count: React.PropTypes.number.isRequired,
    delta: React.PropTypes.number.isRequired,
    search: React.PropTypes.string,

    Link : React.PropTypes.element,

    newMsg: React.PropTypes.string,
    searchMsg: React.PropTypes.string,
    operationMsg: React.PropTypes.string,
    deleteButtonMsg: React.PropTypes.string,
    deleteAskMsg: React.PropTypes.string,

    newAddress: React.PropTypes.string,
    listAddress: React.PropTypes.string,
    deleteEntitiesUrl: React.PropTypes.string,
    updateEntitiesUrl: React.PropTypes.string
  },

  render: function () {
    var columns = this.props.columns
    var BodyRows = (function (self) {
      if (self.state.loading === true) {
        return <TableLoading loadingSpin = {self.props.loadingSpin} />
      } else {
        return <TableBody rows={self.state.rows}
          columns={columns}
          tableName={self.props.tableName}
          from={self.context.utils.toInt(self.props.from)}
          count={self.props.count}
          search = {self.state.search}
          actions = {CrudActions}
          loadingSpin = {self.props.loadingSpin}
          deleteNeeded = {(self.props.deleteEntitiesUrl) ? true : false}
          updateNeeded = {(self.props.updateEntityUrl) ? true : false}
        />
      }
    })(this)

    return (
      <div id="crudList">
        <div className="row">
          <div className="large-1 medium-3 small-6 columns">
            <a onClick={this._deleteEntities} className="button tiny alert">
            {this._getDeleteSelectedText() + (this.props.deleteButtonMsg||" Устгах")}
            </a>
          </div>
          <div className="large-1 medium-3 small-6 columns">
          {(this.props.newAddress) ?
            <this.props.Link to={this.props.newAddress} params={{efrom: this.props.from}} className="button tiny success">
              {this.props.newMsg||"Нэмэх"}
            </this.props.Link>
            : null}
          </div>
          <div className="large-4 medium-12 small-12 columns">
            <this.context.pagination
              size={this.state.size} listFrom={this.context.utils.toInt(this.props.from)}
              rowCount={this.props.count} delta={this.props.delta}
              listAddress={this.props.listAddress}
              utils = {this.context.utils}
            />
          </div>
          <div className="large-6 medium-12 small-12 columns">
            <input type="text" defaultValue={this.state.search} onKeyUp={this._search}
              placeholder={this.props.searchMsg||"Хайлт"}/>
          </div>
          <div className="large-12 medium-12 small-12 columns">
            <table role="grid">
              <thead>
                <tr>
                {(this.props.deleteEntitiesUrl) ?
                  <td>
                    <input type="checkbox" checked={this.state.selectAll} onChange={this._selectAll}/>
                  </td>
                  : null}
                    {Object.keys(columns).map(function (key) {
                      return <td key={key}>{columns[key].name}</td>
                    })}
                  {(this.props.deleteEntitiesUrl) ?
                    <td>{this.props.operationMsg||"Үйлдлүүд"}</td>
                    : null}
                </tr>
              </thead>
                {BodyRows}
            </table>
          </div>
          <div className="large-10 medium-12 small-12 columns">
            <this.context.pagination
              size={this.state.size} listFrom={this.context.utils.toInt(this.props.from)}
              rowCount={this.props.count} delta={this.props.delta}
              listAddress={this.props.listAddress}
              utils = {this.context.utils}
            />
          </div>
        </div>
      </div>
    )
  }

})

module.exports = CrudList
