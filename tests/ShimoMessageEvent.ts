import test from 'ava'
import { SOURCE_NAMESPACE } from '../src/constants'
import {
  isShimoMessageEventLike,
  ShimoMessageEvent
} from '../src/message-event'

test('isShimoMessageEventLike should works', t => {
  const tests: Array<{ data: any, expected: boolean }> = [
    {
      data: new ShimoMessageEvent({
        data: 'hello',
        context: { channelId: 'test', messageId: 'id' },
        time: Date.now(),
        channelId: 'test',
        emitter: 'emitter'
      }),
      expected: true
    },
    {
      data: {
        context: {},
        emitter: 'emitter',
        channelId: 'test',
        source: SOURCE_NAMESPACE
      },
      expected: true
    },
    {
      data: {
        emitter: 'emitter',
        channelId: 'test',
        source: SOURCE_NAMESPACE
      },
      expected: false
    },
    {
      data: {
        context: {},
        emitter: 'emitter',
        channelId: 'test'
      },
      expected: false
    }
  ]

  for (let index = 0; index < tests.length; index++) {
    const test = tests[index]
    t.is(isShimoMessageEventLike(test.data), test.expected, `test#${index} failed`)
  }
})
