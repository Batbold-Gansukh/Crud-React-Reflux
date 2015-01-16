'use strict'
var React = require('react')
var CrudActions = require('../actions/CrudActions')
var Link = require('react-router').Link
var Navigation = require('react-router').Navigation
var CrudActionStore = require('../stores/CrudActionStore')

var CrudNew = React.createClass({
    mixins: [Navigation],
    getInitialState: function () {
        return {status: null, msg: null, loading: false}
    },
    _createNew: function (columnValues) {
        var values = {"table": this.props.tableName, "columns": columnValues}
        CrudActions.createNew(values,this.context.token)
        this.state.loading = true
        this.state.status = null
        this.setState(this.state)
    },
    componentDidMount: function () {
        CrudActionStore.createNewUrl = this.props.createNewUrl
        this.unsubscribe = CrudActionStore.listen(this._statusUpdate)
    },
    componentWillUnmount: function () {
        this.unsubscribe()
    },
    _statusUpdate: function (status) {
        var msg = (function () {
            return status === "success" ? "Амжилттай боллоо" : "Амжилтгүй боллоо"
        })()
        this.setState({msg: msg, status: status, loading: false})
    },
    _backAction: function () {
        this.transitionTo(this.props.listAddress, {efrom: this.props.from})
    },
    contextTypes: {
        form: React.PropTypes.func.isRequired,
        token: React.PropTypes.string,
        utils: React.PropTypes.object.isRequired
    },
    render: function () {
        var columns = this.props.columns
        return <this.context.form
            columns={columns}
            tableDescription={this.props.tableDescription}
            msg={this.state.msg}
            status={this.state.status}
            loadingSpin = {this.props.loadingSpin}
            loading = {this.state.loading}
            commitLabel = "Нэмэх"
            backLabel = "Буцах"
            backAction = {this._backAction}
            commitAction = {this._createNew}
        />
    }
})

module.exports = CrudNew