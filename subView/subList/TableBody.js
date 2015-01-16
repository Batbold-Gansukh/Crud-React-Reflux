var React = require('react')
var TableCell = require('./subTableBody/TableCell')
var _ = require('lodash')

var TableBody = React.createClass({
  _deleteEntity: function (id) {
    if (confirm("Устгах уу?")) {
      this.props.actions.deleteEntities(this.props.tableName, [id], this.props.from,
        this.props.count, this.props.search, this.context.token)
    }
  },
  _selectEntity: function (id, evt) {
    this.props.actions.selectEntity(id, evt.target.checked, this.context.token)
  },
  contextTypes: {
    token: React.PropTypes.string
  },
  propTypes:{
    deleteNeeded: React.PropTypes.bool.isRequired,
    updateNeeded: React.PropTypes.bool.isRequired
  },
  render: function () {
    var columns = this.props.columns
    var rows = this.props.rows || {}
    var self = this
    return (
      <tbody>
        {_.keys(rows).map((index, i) => {
          var row = rows[index]
          return (<tr key={i}>
            {(this.props.deleteNeeded)?
            <td>
              <input type="checkbox" checked={row.selected}
                onChange={self._selectEntity.bind(self, row.ID)}/>
            </td>
              :null}
              {_.keys(columns).map((key, i) => {
                return (<TableCell key={key} value={row[key]}
                  tableName={self.props.tableName}
                  from={self.props.from}
                  count={self.props.count}
                  id={row.ID}
                  columnName={columns[key].columnName}
                  search={self.props.search}
                  columnType={columns[key].type || "string"}
                  actions={self.props.actions}
                  loadingSpin={self.props.loadingSpin}
                  updateNeeded = {self.props.updateNeeded}
                />)
              })}
            {(this.props.deleteNeeded)?
            <td>
              <a className="inline-cancel" onClick={self._deleteEntity.bind(self, row.ID)}>&#x2717;</a>
            </td>
            :null}
          </tr>)
        })}
      </tbody>)
  }
})

module.exports = TableBody