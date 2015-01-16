var React = require('react')

var TableLoading = React.createClass({
    render: function () {
        return <tbody>
            <tr>
                <td>
                    <img src={this.props.loadingSpin} width="32"/>
                </td>
            </tr>
        </tbody>
    }
})

module.exports = TableLoading
