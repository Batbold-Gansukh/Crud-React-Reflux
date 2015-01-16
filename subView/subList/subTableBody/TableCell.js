var React = require('react')

var TableCell = React.createClass({
  isEditing: function () {
    return (this.state.status === true)
  },
  getInitialState: function () {
    return {status: undefined, editSymbol: undefined}
  },
  componentWillReceiveProps: function () {
    this.state.status = undefined
  },
  _mouseOver: function () {
    if (!this.isEditing()) {
      var newState = this.state
      newState.editSymbol = "\u270e"
      this.setState(newState)
    }
  },
  _mouseOut: function () {
    if (!this.isEditing()) {
      var newState = this.state
      newState.editSymbol = undefined
      this.setState(newState)
    }
  },
  _clickEdit: function () {
    this._startEditing()
  },
  _updateEdit: function () {
    this._commitUpdate()
  },
  _cancelEdit: function () {
    this._cancelEditing()
  },
  _doubleClick: function () {
    this._startEditing()
  },
  _onKeyUp: function (evt) {
    //27 13
    if (evt.which == 27) {
      evt.preventDefault()
      this._cancelEdit()
    } else if (evt.which == 13) {
      evt.preventDefault()
      this._commitUpdate()
    }
  },
  _startEditing: function () {
    this.setState({status: true}, function () {
      if (this.refs.editInput !== undefined && this.refs.editInput.getDOMNode !== undefined) {
        this.refs.editInput.getDOMNode().focus()
        this.refs.editInput.getDOMNode().select()
      }
    })
  },
  _cancelEditing: function () {
    this.setState({status: false})
  },
  _commitUpdate: function () {
    this.props.actions.commitUpdate(this.props.tableName, this.props.columnName, this.props.id,
      this.refs.editInput.getDOMNode().value, this.props.from, this.props.count, this.props.search,
      this.props.columnType, this.context.token)
    //this.state.status = "committing"
    this.setState({status: "committing"})
  },
  contextTypes: {
    intRender: React.PropTypes.func,
    floatRender: React.PropTypes.func,
    imgRender: React.PropTypes.func,
    intEditRender: React.PropTypes.func,
    floatEditRender: React.PropTypes.func,
    dateEditRender: React.PropTypes.func,
    imgEditRender: React.PropTypes.func,
    modalAlert: React.PropTypes.func,
    dateInput: React.PropTypes.func,
    token: React.PropTypes.string,
    utils: React.PropTypes.object
  },
  propTypes: {
    columnType: React.PropTypes.string,
    value: React.PropTypes.any,
    key: React.PropTypes.string,
    loadingSpin: React.PropTypes.string,
    updateNeeded: React.PropTypes.bool.isRequired
  },
  render: function () {

    var cellHTML = ((self) => {
      switch (self.props.columnType) {
        case "int":
        {
          var intRender = self.context.intRender || ((value) => {
              return value
            })
          return intRender(self.props.value)
        }
        case "float":
        {
          var floatRender = self.context.floatRender || ((value)=> {
              return value
            })
          return floatRender(self.props.value)
        }
        case "date":
        {
          var dateRender = self.context.dateRender || self.context.utils.formatDate
          return dateRender(self.props.value)
        }
        case "img":
        {
          var imgRender = self.context.imgRender || ((value)=> {
              return <img width="42" src={value}/>
            })
          return imgRender(self.props.value)
        }
        default:
          return self.props.value
      }
    })(this)

    var editHTML = ((self) => {
      var value = self.props.value
      var updateCancel = (<span>
        <span onClick={self._updateEdit} className="inline-update">&#10004;</span>
        <span onClick={self._cancelEdit} className="inline-cancel">&#x2717;</span>
      </span>)
      var defaultEdit = (<span>
        <input ref="editInput" type="text" defaultValue={value} onKeyUp={self._onKeyUp}/>
        {updateCancel}
      </span>)
      switch (self.props.columnType) {
        case "int":
        {
          return self.context.intEditRender || defaultEdit;
        }
        case "float":
        {
          return self.context.floatEditRender || defaultEdit;
        }
        case "date":
        {
          if (self.context.dateEditRender !== undefined) {
            return self.context.dateEditRender
          } else {
            var dateUpdateEdit = function (value) {
              self.refs.editInput.getDOMNode().value = value
              self._updateEdit()
            }
            return <span>
              <self.context.dateInput
                cancelEdit={self._cancelEdit}
                updateEdit={dateUpdateEdit}
                utils = {self.context.utils}
                value={value}
              />
              <input type="hidden" ref="editInput" />
            </span>
          }
        }
        case "img":
        {
          return self.context.imgEditRender || defaultEdit;
        }
        default:
          return defaultEdit;
      }
    })(this)

    var cell = ((self) => {
      if (self.state.status === undefined || self.state.status === false) {
        return (<span onDoubleClick={self._doubleClick}>
                    {cellHTML}
          <span onClick={self._clickEdit} className="inline-edit">{self.state.editSymbol}</span>
        </span>)
      } else if (self.state.status === "committing") {
        return <span>
          <img width="16" src={self.props.loadingSpin} />
        </span>
      } else {
        return <self.context.modalAlert closeCallback={self._cancelEdit} inner={editHTML}/>
      }
    })(this)

    return (<td onMouseOver={this.props.updateNeeded ? this._mouseOver : null}
      onMouseOut={this.props.updateNeeded ? this._mouseOut : null} key={this.props.key}>
        {cell}
    </td>)

  }
})

module.exports = TableCell