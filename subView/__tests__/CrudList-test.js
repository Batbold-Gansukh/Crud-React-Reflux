jest.dontMock('../CrudList')
jest.dontMock('lodash')
jest.dontMock('reflux')

describe('CrudList', ()=> {
  var CrudList = require('../CrudList'), React = require('react/addons'),
    TestUtils = React.addons.TestUtils

  var tableName = "tableName", search = "search", loadingSpin = "loadingSpin", from = "1", delta = 2,
    count = 10, actions = {}, deleteCallback = jest.genMockFn, deleteNeeded = false, updateNeeded = false,
    Link, transitionTo, newMsg = "newMsg", searchMsg = "searchMsg", operationMsg = "operationMsg",
    deleteButtonMsg = "deleteButtonMsg", deleteAskMsg = "deleteAskMsg",
    newAddress = 'newAddress', listAddress = 'listAddress',
    deleteEntitiesUrl = 'deleteEntitiesUrl',
    listEntitiesUrl = 'listEntitiesUrl',
    updateEntitiesUrl = 'updateEntitiesUrl', modalAlert

  var Utils = {
    toInt: jest.genMockFn(),
    paginationSize: jest.genMockFn()
  }
  var Pagination = jest.genMockFn()
  var Link = jest.genMockFn()

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

  var TableLoading = require("../subList/TableLoading")
  var TableBody = require("../subList/TableBody")

  beforeEach(()=>{
    TableLoading.mockClear()
    TableBody.mockClear()
  })

  it("should display correctly", ()=> {

    var tb = TestUtils.renderIntoDocument(React.withContext({
      modalAlert: modalAlert,
      utils: Utils,
      pagination: Pagination
    }, ()=> {
      return <CrudList
        columns={columns}
        tableName={tableName}
        search={search}
        loadingSpin={loadingSpin}
        from={from}
        count={count}
        delta={delta}

        Link ={Link}
        transitionTo={transitionTo}

        newMsg = {newMsg}
        searchMsg={searchMsg}
        operationMsg={operationMsg}
        deleteButtonMsg ={deleteButtonMsg}
        deleteAskMsg ={deleteAskMsg}

        newAddress={newAddress}
        listAddress={listAddress}
        deleteEntitiesUrl={deleteEntitiesUrl}
        updateEntitiesUrl = {updateEntitiesUrl}
        listEntitiesUrl = {listEntitiesUrl}

      />
    }))

    TableLoading.mockClear()
    TableBody.mockClear()
    Link.mockClear()
    tb._loadEntities()
    expect(TableLoading).toBeCalled()

    tb._update(rows,Object.keys(rows).length)
    expect(TableBody).toBeCalled()

    expect(Link).toBeCalled()
    var deleteAll = TestUtils.scryRenderedDOMComponentsWithClass(tb,'deleteEntities')
    expect(deleteAll.length).toBe(1)
  })

  it("should not display create delete when necessary", ()=> {

    var tb = TestUtils.renderIntoDocument(React.withContext({
      modalAlert: modalAlert,
      utils: Utils,
      pagination: Pagination
    }, ()=> {
      return <CrudList
        columns={columns}
        tableName={tableName}
        search={search}
        loadingSpin={loadingSpin}
        from={from}
        count={count}
        delta={delta}

        Link ={Link}
        transitionTo={transitionTo}

        newMsg = {newMsg}
        searchMsg={searchMsg}
        operationMsg={operationMsg}
        deleteButtonMsg ={deleteButtonMsg}
        deleteAskMsg ={deleteAskMsg}

        //newAddress={newAddress}
        listAddress={listAddress}
        //deleteEntitiesUrl={deleteEntitiesUrl}
        updateEntitiesUrl = {updateEntitiesUrl}
        listEntitiesUrl = {listEntitiesUrl}

      />
    }))

    Link.mockClear()

    expect(Link).not.toBeCalled()
    var deleteAll = TestUtils.scryRenderedDOMComponentsWithClass(tb,'deleteEntities')
    expect(deleteAll.length).toBe(0)
  })

})