jest.dontMock('../TableBody')
jest.dontMock('lodash')

describe('TableBody', ()=> {
  var TableBody = require('../TableBody'), React = require('react/addons'),
    TestUtils = React.addons.TestUtils

  var tableName = "tableName", search = "search", loadingSpin = "loadingSpin", from = 1,
    count = 10, actions = {}, deleteCallback = jest.genMockFn, deleteNeeded = false, updateNeeded = false,
    modalAlert

  var columns = {
    NAME: {name: "Нэр", columnName: "NAME", min: 1},
    DEVJEE: {name: "Дэвжээ", columnName: "DEVJEE"},
    TSOL: {name: "Цол", columnName: "TSOL"},
    IMG: {name: "Зураг", type: "img", columnName: "IMG", min: 1},
    BIRTHDATE: {name: "Төрсөн", columnName: "BIRTHDATE", type: "date"},
    WEIGHT: {name: "Жин", columnName: "WEIGHT", type: "int", isOptional: true},
    HEIGHT: {name: "Өндөр", columnName: "HEIGHT", type: "int", min: 100, max: 1000}
  }

  var rows = {
    "1": {
      "NAME": "Осорбал ХАШ-ЭРДЭНЭ",
      "DEVJEE": "Devjee",
      "TSOL": "Сумын заан",
      "IMG": "/assets/dist/images/mongol-buh/2014-11-19-13-52-40.jpg",
      "WEIGHT":200,
      "HEIGHT":200
    }, "2": {
      "NAME": "Б СОДНОМДОРЖ",
      "DEVJEE": "Devjee",
      "TSOL": "Сумын заан",
      "IMG": "/assets/dist/images/mongol-buh/2014-11-09-21-49-10.png",
      "WEIGHT":200,
      "HEIGHT":200
    }, "3": {
      "NAME": "П СЭДЭД",
      "DEVJEE": "Devjee",
      "TSOL": "Аймгийн начин",
      "IMG": "/assets/dist/images/mongol-buh/2014-11-09-21-23-56.png",
      "WEIGHT":200,
      "HEIGHT":200
    }, "4": {
      "NAME": "Ган АТАР",
      "DEVJEE": "Devjee",
      "TSOL": "Аймгийн начин",
      "IMG": "/assets/dist/images/mongol-buh/2014-10-16-11-22-06.jpg",
      "WEIGHT":200,
      "HEIGHT":200
    }, "5": {
      "NAME": "Цэрэндолгор НАРАНГЭРЭЛ",
      "DEVJEE": "Devjee",
      "TSOL": "Аймгийн харцага",
      "IMG": "/assets/dist/images/mongol-buh/2014-02-05-11-12-46.png",
      "WEIGHT":200,
      "HEIGHT":200
    }
  }

  var TableCell = require('../subTableBody/TableCell')

  beforeEach(()=> {
    modalAlert = jest.genMockFn
  })

  it("should display correctly", ()=> {

    var tb = TestUtils.renderIntoDocument(React.withContext({
      modalAlert: modalAlert
    }, ()=> {
      return <TableBody
        columns={columns}
        rows={rows}

        tableName={tableName}
        search={search}
        loadingSpin={loadingSpin}
        from={from}
        count={count}
        actions={actions}

        deleteCallback={deleteCallback}
        deleteNeeded={true}
        updateNeeded={true}
      />
    }))

    expect(TestUtils.scryRenderedDOMComponentsWithTag(tb,'input').length).toBe(Object.keys(rows).length)
    expect(TestUtils.scryRenderedDOMComponentsWithClass(tb,'row-delete').length).toBe(Object.keys(rows).length)
    expect(TableCell.mock.calls.length).toBe(Object.keys(rows).length * Object.keys(columns).length)

  })
})