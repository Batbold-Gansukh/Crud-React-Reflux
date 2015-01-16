var React = require('react')
var CrudActions = require('../actions/CrudActions')
var CrudActionStore = require('../stores/CrudActionStore')

var CrudNew = React.createClass({
  getInitialState() {
    return {status: null, msg: null, loading: false}
  },
  _createNew(columnValues) {
    var values = {"table": this.props.tableName, "columns": columnValues}
    CrudActions.createNew(values, this.context.token)
    this.state.loading = true
    this.state.status = null
    this.setState(this.state)
  },
  componentDidMount() {
    CrudActionStore.createNewUrl = this.props.createNewUrl
    this.unsubscribe = CrudActionStore.listen(this._statusUpdate)
  },
  componentWillUnmount() {
    this.unsubscribe()
  },
  _statusUpdate(status) {
    var props = this.props
    var msg = (function () {
      return status === "success" ? (props.successMsg || "Амжилттай боллоо")
        : (props.errorMsg || "Амжилтгүй боллоо")
    })()
    this.setState({msg: msg, status: status, loading: false})
  },
  _backAction() {
    this.props.transitionTo(this.props.listAddress, {efrom: this.props.from})
  },
  contextTypes: {
    form: React.PropTypes.func.isRequired,
    token: React.PropTypes.string,
    utils: React.PropTypes.object.isRequired
  },
  propTypes: {
    tableName: React.PropTypes.string,
    tableDescription: React.PropTypes.string,
    columns: React.PropTypes.object.isRequired,
    listAddress: React.PropTypes.string,
    from: React.PropTypes.string.isRequired,
    loadingSpin: React.PropTypes.string.isRequired,
    createNewUrl: React.PropTypes.string.isRequired,

    successMsg: React.PropTypes.string,
    errorMsg: React.PropTypes.string,
    commitLabel: React.PropTypes.string,
    backLabel: React.PropTypes.string,

    transitionTo: React.PropTypes.func.isRequired
  },
  render() {
    var columns = this.props.columns
    return <this.context.form
      columns={columns}
      tableDescription={this.props.tableDescription}
      msg={this.state.msg}
      status={this.state.status}
      loadingSpin = {this.props.loadingSpin}
      loading = {this.state.loading}
      commitLabel = {this.props.commitLabel || "Нэмэх"}
      backLabel = {this.props.backLabel || "Буцах"}
      backAction = {this._backAction}
      commitAction = {this._createNew}
    />
  }
})

module.exports = CrudNew