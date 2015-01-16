jest.dontMock('../TableCell')

describe('FormInputRender', ()=> {

  var TableCell = require('../TableCell'), React = require('react/addons'),
    TestUtils = React.addons.TestUtils, columnType, value, key, loadingSpin

  beforeEach(()=> {
    key = "key"
    loadingSpin = "loadingSpin"
  })

  it("should display correctly when img", ()=> {
    columnType = "img"
    value = "imgUrl"
    var modalAlert = jest.genMockFunction()
    var tc = TestUtils.renderIntoDocument(React.withContext({
      modalAlert: modalAlert
    }, ()=> {
      return <TableCell
        columnType={columnType}
        value ={value}
        key= {key}
        loadingSpin={loadingSpin}
      />
    }))
    var img = TestUtils.findRenderedDOMComponentWithTag(tc, "img")
    expect(img.getDOMNode().attributes.src._nodeValue).toBe(value)
    var update = TestUtils.findRenderedDOMComponentWithClass(tc, "inline-edit")
    expect(modalAlert).not.toBeCalled()
    TestUtils.Simulate.click(update)
    expect(modalAlert).toBeCalled()
  })

  it("should display correctly when date", ()=> {
    columnType = "date"
    value = new Date().getTime()
    var dateEditRender = jest.genMockFunction()
    var modalAlert = jest.genMockFunction()
    var tc = TestUtils.renderIntoDocument(React.withContext({
      dateEditRender: dateEditRender,
      modalAlert: modalAlert,
      utils: {
        formatDate: (d)=> {
          return <label className="dateLabel">{d}</label>
        }
      }
    }, ()=> {
      return <TableCell
        columnType={columnType}
        value ={value}
        key= {key}
        loadingSpin={loadingSpin}
      />
    }))
    var label = TestUtils.findRenderedDOMComponentWithClass(tc, "dateLabel")
    expect(label.getDOMNode().innerHTML).toBe(value + "")
    var update = TestUtils.findRenderedDOMComponentWithClass(tc, "inline-edit")
    expect(modalAlert).not.toBeCalled()
    TestUtils.Simulate.click(update)
    expect(modalAlert).toBeCalled()
  })

})
