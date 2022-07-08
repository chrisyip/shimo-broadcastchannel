shimo-broadcast-channel / [Exports](modules.md)

# ShimoBroadcastChannel

基于 [BroadcastChannel]() 封装了一个更易用的通信库。

兼容 Chrome、IE 11、Firefox 和 Safari，但需要 `Object.assign()`，在 IE 11 下使用需要引入 polyfill。

# Usage

```typescript
import { ShimoBroadcastChannel } from 'shimo-broadcast-channel'

const channel = new ShimoBroadcastChannel({
  channelId: 'test'
})

await channel.postMessage('message')

channel.on('message', (msg: ShimoMessageEvent) => {
  handleMessageData(msg.data)
})

// 直接从其他频道取回值
const myValue = await channel.invoke('my_method', [arg1, arg2, ...])
```

## Context

Context 是用于传递和消息有关的上下文，在消息传递时会保留。

`Context.audiecen: string`

用于限定消息听众，比如 `channel.postMessage(msg, { audience: 'a' })`：

- `on('message', fn, { audience: 'a' })` 会收到消息
- `on('message', fn, { audience: 'b' })` 不会收到消息
- `on('message', fn, { audience: '' })` 不会收到消息
- `on('message', fn)` 不会收到消息

`channel.invoke(method, [], { audience: 'a' })`：

- `addInvokeHandler(method, fn, { audience: 'a' })` 会收到消息
- `addInvokeHandler(method, fn, { audience: 'b' })` 不会收到消息
- `addInvokeHandler(method, fn, { audience: '' })` 不会收到消息
- `addInvokeHandler(method, fn)` 不会收到消息

## BroadcastChannel 无法使用时

在 BroadcastChannel 无法使用的场合，比如 cross origin，可以用 `channel.addMessagePoster()` 和 `channel.distributeMessage()` 转发消息。

以 iframe 为例。

Parent window：

```typescript
import {
  SOURCE_NAMESPACE, // 'ShimoBroadcastChannel'
  ShimoBroadcastChannel
} from 'shimo-broadcast-channel'

const iframe = document.querySelector('iframe')

const channel = new ShimoBroadcastChannel({
  channelId: 'test'
})

// 监听 postMessage 事件，把消息通过其他方式发出去
channel.on('postMessage', (evt: ShimoMessageEvent) => {
  iframe.contentWindow.postMessage(evt, '*')
})

window.addEventListener('message', (evt: MessageEvent) => {
  // 如果消息符合规则，则让 channel 来分发消息
  if (evt.data && evt.data.source === SOURCE_NAMESPACE) {
    channel.distributeMessage(evt.data)
    // 将消息转发到 same origin channel
    channel.postMessage(evt.data).catch(errorHandler)
  }
})

channel.addInvokeHandler('greeting', (name: string) => {
  return `Hello, ${name}`
})

channel.on('message', (evt: ShimoMessageEvent) => {
  console.log(evt.data) // 'Hello, John'
})
```

iframe window：

```typescript
import {
  SOURCE_NAMESPACE,
  ShimoBroadcastChannel
} from 'shimo-broadcast-channel'

const channel = new ShimoBroadcastChannel({
  channelId: 'test'
})

// 监听 postMessage 事件，把消息通过其他方式发出去
channel.on('postMessage', (evt: ShimoMessageEvent) => {
  window.parent.postMessage(evt, '*')
})

window.addEventListener('message', (evt: MessageEvent) => {
  // 如果消息符合规则，则让 channel 来分发消息
  if (evt.data && evt.data.source === SOURCE_NAMESPACE) {
    channel.distributeMessage(evt.data)
    // 将消息转发到 same origin channel
    channel.postMessage(evt.data).catch(errorHandler)
  }
})

channel.invoke('greeting', ['John']).then((msg: string) => {
  console.log(msg) // 'Hello, John'

  channel.postMessage(msg)
})
```

> 多重 iframe 嵌套或一个 window 嵌套多个 iframe，用上述方式会导致 BroadcastChannel 中有多条重复消息，建议只在单 window 到单 iframe 的情况下使用，或使用 `onMessageArrive` 进行去重。

```typescript
const channel = new ShimoBroadcastChannel()

const cache = new SomeCache({ ttl: CACHE_TTL })

channel.onMessageArrive = async (evt: ShimoMessageEvent) => {
  // 抛弃超过缓存时间后收到的旧消息
  if (Date.now() - evt.time > CACHE_TTL) {
    return
  }

  // 消息在 cache 中说明被处理过
  if (await cache.has(evt.id)) {
    return
  }
  cache.add(evt.id)
  return evt
}
```
