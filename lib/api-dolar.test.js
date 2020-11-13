const api = require('./api-dolar')
const axios = require('axios')

jest.mock('axios')

test('getCotacaoAPI', () => {
  const res = {
    data: {
      value: [
        { cotacaoVenda: 5.30 }
      ]
    }
  }
  axios.get.mockResolvedValue(res)
  api.getCotacaoAPI('url').then(resp => {
    expect(resp).toEqual(res)
    expect(axios.get.mock.calls[0][0]).toBe('url')
  })
})

test('extractCotacao', () => {
  const cotacao = api.extractCotacao({
    data: {
      value: [
        { cotacaoVenda: 5.30 }
      ]
    }
  })
  expect(cotacao).toBe(5.30)
})

describe('getToday', () => {
  const RealDate = Date

  function mockDate(date) {
    global.Date = class extends RealDate {
      constructor() {
        return new RealDate(date)
      }
    }
  }
  afterEach(() => {
    global.Date = RealDate
  })

  test('getToday', () => {
    mockDate('2020-01-01T12:00:00z')
    const today = api.getToday()
    expect(today).toBe('1-1-2020')
  })

})

test('getUrl', () => {
  const url = api.getUrl('Minha-Data')
  expect(url).toBe("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27Minha-Data%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao")
})

test('getCotacao', () => {
  const res = {
    data: {
      value: [
        { cotacaoVenda: 5.30 }
      ]
    }
  }
  const getToday = jest.fn()
  getToday.mockReturnValue('01-01-2020')

  const getUrl = jest.fn()
  getUrl.mockReturnValue('url')

  const getCotacaoAPI = jest.fn()
  getCotacaoAPI.mockReturnValue(res)

  const extractCotacao = jest.fn()
  extractCotacao.mockReturnValue(5.3)

  api.pure
    .getCotacao({ getToday, getCotacaoAPI, getUrl, extractCotacao })()
    .then(res => {
      expect(res).toBe(5.4)
    })

})


test('getCotacao', () => {
  const res = {
  }
  const getToday = jest.fn()
  getToday.mockReturnValue('01-01-2020')

  const getUrl = jest.fn()
  getUrl.mockReturnValue('url')

  const getCotacaoAPI = jest.fn()
  getCotacaoAPI.mockReturnValue(Promise.reject('err'))

  const extractCotacao = jest.fn()
  extractCotacao.mockReturnValue(5.3)

  api.pure
    .getCotacao({ getToday, getCotacaoAPI, getUrl, extractCotacao })()
    .then(res => {
      expect(res).toBe('')
    })

})


