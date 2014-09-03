describe 'yap', ->
  yap = require('../tmp/yap')

  it 'should politely greet visitors', ->
    expect(yap.greet()).toEqual 'Hello World ☕'
