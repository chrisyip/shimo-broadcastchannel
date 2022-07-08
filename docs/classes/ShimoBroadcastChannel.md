[shimo-broadcast-channel](../README.md) / [Exports](../modules.md) / ShimoBroadcastChannel

# Class: ShimoBroadcastChannel

## Table of contents

### Constructors

- [constructor](ShimoBroadcastChannel.md#constructor)

### Properties

- [autoStructuredClone](ShimoBroadcastChannel.md#autostructuredclone)
- [channel](ShimoBroadcastChannel.md#channel)
- [emitter](ShimoBroadcastChannel.md#emitter)
- [emitterId](ShimoBroadcastChannel.md#emitterid)
- [eventHandlers](ShimoBroadcastChannel.md#eventhandlers)
- [id](ShimoBroadcastChannel.md#id)
- [invokeHandlers](ShimoBroadcastChannel.md#invokehandlers)
- [onMessageArrive](ShimoBroadcastChannel.md#onmessagearrive)

### Accessors

- [debug](ShimoBroadcastChannel.md#debug)

### Methods

- [addEventListener](ShimoBroadcastChannel.md#addeventlistener)
- [addInvokeHandler](ShimoBroadcastChannel.md#addinvokehandler)
- [distributeMessage](ShimoBroadcastChannel.md#distributemessage)
- [emit](ShimoBroadcastChannel.md#emit)
- [handleInvokeRequest](ShimoBroadcastChannel.md#handleinvokerequest)
- [handleInvokeResponse](ShimoBroadcastChannel.md#handleinvokeresponse)
- [initMessageEvent](ShimoBroadcastChannel.md#initmessageevent)
- [invoke](ShimoBroadcastChannel.md#invoke)
- [mergeContexts](ShimoBroadcastChannel.md#mergecontexts)
- [off](ShimoBroadcastChannel.md#off)
- [on](ShimoBroadcastChannel.md#on)
- [once](ShimoBroadcastChannel.md#once)
- [postMessage](ShimoBroadcastChannel.md#postmessage)
- [removeInvokeHandler](ShimoBroadcastChannel.md#removeinvokehandler)
- [structuredClone](ShimoBroadcastChannel.md#structuredclone)

## Constructors

### constructor

• **new ShimoBroadcastChannel**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`Options`](../interfaces/Options.md) |

#### Defined in

src/shimo-broadcast-channel.ts:57

## Properties

### autoStructuredClone

• **autoStructuredClone**: `boolean`

是否启用自动 structuredClone 在发送前对数据进行处理

#### Defined in

src/shimo-broadcast-channel.ts:41

___

### channel

• `Private` `Readonly` **channel**: `BroadcastChannel`<`any`\>

#### Defined in

src/shimo-broadcast-channel.ts:43

___

### emitter

• `Private` `Readonly` **emitter**: `TinyEmitter`

#### Defined in

src/shimo-broadcast-channel.ts:45

___

### emitterId

• `Private` `Readonly` **emitterId**: `string`

#### Defined in

src/shimo-broadcast-channel.ts:55

___

### eventHandlers

• `Private` `Readonly` **eventHandlers**: `Map`<`string`, [[`EventHandler`](../modules.md#eventhandler)<`unknown`\>, BaseContext?][]\>

#### Defined in

src/shimo-broadcast-channel.ts:50

___

### id

• `Readonly` **id**: `string`

Channel ID，ID 一致才能通信

#### Defined in

src/shimo-broadcast-channel.ts:29

___

### invokeHandlers

• `Private` `Readonly` **invokeHandlers**: `Map`<`string`, `InvokeInternalHandler`[]\>

#### Defined in

src/shimo-broadcast-channel.ts:47

___

### onMessageArrive

• `Optional` **onMessageArrive**: [`OnMessageArrive`](../modules.md#onmessagearrive)

消息到达时的回调函数，在消息正式分发前被调用，也会影响到 `invoke()`。
返回 undefined 时，消息将会被抛弃。
一般用于消息去重。

#### Defined in

src/shimo-broadcast-channel.ts:36

## Accessors

### debug

• `get` **debug**(): `boolean`

是否开启 debug 模式。

#### Returns

`boolean`

#### Defined in

src/shimo-broadcast-channel.ts:499

• `set` **debug**(`enable`): `void`

是否开启 debug 模式。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `enable` | `boolean` | 是否开启 debug 模式。 |

#### Returns

`void`

#### Defined in

src/shimo-broadcast-channel.ts:495

## Methods

### addEventListener

▸ `Private` **addEventListener**(`name`, `listener`, `context?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `listener` | [`EventHandler`](../modules.md#eventhandler)<`unknown`\> |
| `context?` | [`BaseContext`](../interfaces/BaseContext.md) |

#### Returns

`void`

#### Defined in

src/shimo-broadcast-channel.ts:125

___

### addInvokeHandler

▸ **addInvokeHandler**(`name`, `handler`, `context?`): `void`

添加 Invoke 处理器。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | 方法名 |
| `handler` | [`InvokeHandler`](../modules.md#invokehandler) | 处理器 |
| `context?` | [`BaseContext`](../interfaces/BaseContext.md) | 消息上下文 |

#### Returns

`void`

#### Defined in

src/shimo-broadcast-channel.ts:450

___

### distributeMessage

▸ **distributeMessage**(`messageEvent`): `Promise`<`void`\>

在当前 channel 实例里分发消息，不会分发到其它 channel 实例。
一般在 BroadcastChannel 收到消息后，由内部调用，外部调用主要用于类似 cross-origin window 的场景，将收到的消息转入 channel 内部处理。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageEvent` | [`ShimoMessageEvent`](ShimoMessageEvent.md) | 消息 |

#### Returns

`Promise`<`void`\>

#### Defined in

src/shimo-broadcast-channel.ts:282

___

### emit

▸ **emit**<`Name`\>(`name`, `data`, `context?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Name` | extends keyof [`Events`](../modules.md#events) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `Name` |
| `data` | [`Events`](../modules.md#events)[`Name`] |
| `context?` | [`Context`](../interfaces/Context.md) |

#### Returns

`void`

#### Defined in

src/shimo-broadcast-channel.ts:214

___

### handleInvokeRequest

▸ `Private` **handleInvokeRequest**(`messageEvent`): `Promise`<`void`\>

响应其他 channel 发送的 Invoke 调用

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageEvent` | [`ShimoMessageEvent`](ShimoMessageEvent.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

src/shimo-broadcast-channel.ts:319

___

### handleInvokeResponse

▸ `Private` **handleInvokeResponse**(`messageEvent`): `void`

处理非当前 channel 响应的 Invoke 结果，会通过 emitter 将 payload 发出去

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageEvent` | [`ShimoMessageEvent`](ShimoMessageEvent.md) |

#### Returns

`void`

#### Defined in

src/shimo-broadcast-channel.ts:359

___

### initMessageEvent

▸ `Private` **initMessageEvent**(`input`): [`ShimoMessageEvent`](ShimoMessageEvent.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | { `context?`: [`Context`](../interfaces/Context.md) ; `data`: `unknown` ; `origin?`: `string` ; `time?`: `number`  } \| [`ShimoMessageEvent`](ShimoMessageEvent.md) |

#### Returns

[`ShimoMessageEvent`](ShimoMessageEvent.md)

#### Defined in

src/shimo-broadcast-channel.ts:100

___

### invoke

▸ **invoke**<`T`\>(`name`, `args`, `context?`): `Promise`<`T`\>

发出一条 Invoke 消息，等待并返回接收到的结果。多个频道响应同一个 Invoke 调用时，只会返回第一个收到的结果。
Invoke 消息并不会触发 `message` 等事件，只会被发送到 channel 中通过 addInvokeHandler 添加的 handler 中。

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | 方法名 |
| `args` | `unknown`[] | 参数列表 |
| `context?` | [`BaseContext`](../interfaces/BaseContext.md) | 消息上下文 |

#### Returns

`Promise`<`T`\>

#### Defined in

src/shimo-broadcast-channel.ts:381

___

### mergeContexts

▸ `Private` **mergeContexts**(`contexts`): [`Context`](../interfaces/Context.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `contexts` | ([`BaseContext`](../interfaces/BaseContext.md) \| [`Context`](../interfaces/Context.md))[] |

#### Returns

[`Context`](../interfaces/Context.md)

#### Defined in

src/shimo-broadcast-channel.ts:369

___

### off

▸ **off**<`Name`\>(`name`, `listener?`, `context?`): `void`

取消事件监听

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Name` | extends keyof [`Events`](../modules.md#events) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `Name` | 事件名称 |
| `listener?` | [`EventHandler`](../modules.md#eventhandler)<[`Events`](../modules.md#events)[`Name`]\> | 监听器，不传则取消所有监听器 |
| `context?` | [`BaseContext`](../interfaces/BaseContext.md) | 监听的消息的上下文，传了则只取消相同上下文 audience 的监听器 |

#### Returns

`void`

#### Defined in

src/shimo-broadcast-channel.ts:189

___

### on

▸ **on**<`Name`\>(`name`, `listener`, `context?`): [`OffEventCallback`](../modules.md#offeventcallback)

监听事件

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Name` | extends keyof [`Events`](../modules.md#events) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `Name` | 事件名称 |
| `listener` | [`EventHandler`](../modules.md#eventhandler)<[`Events`](../modules.md#events)[`Name`]\> | 监听器 |
| `context?` | [`BaseContext`](../interfaces/BaseContext.md) | 监听的消息的上下文，传了则只会收到相同上下文 audience 的消息 |

#### Returns

[`OffEventCallback`](../modules.md#offeventcallback)

#### Defined in

src/shimo-broadcast-channel.ts:145

___

### once

▸ **once**<`Name`\>(`name`, `listener`, `context?`): [`OffEventCallback`](../modules.md#offeventcallback)

监听事件，触发一次后自动会 off

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Name` | extends keyof [`Events`](../modules.md#events) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `Name` | 事件名称 |
| `listener` | [`EventHandler`](../modules.md#eventhandler)<[`Events`](../modules.md#events)[`Name`]\> | 监听器 |
| `context?` | [`Context`](../interfaces/Context.md) | 监听的消息的上下文，传了则只会收到相同上下文 audience 的消息 |

#### Returns

[`OffEventCallback`](../modules.md#offeventcallback)

#### Defined in

src/shimo-broadcast-channel.ts:164

___

### postMessage

▸ **postMessage**(`message`, `context?`): `Promise`<`void`\>

发出一条消息到 channel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `unknown` | 消息 |
| `context?` | [`BaseContext`](../interfaces/BaseContext.md) | 消息的上下文，传了则只有相同上下文 audience 的监听器才能收到消息 |

#### Returns

`Promise`<`void`\>

#### Defined in

src/shimo-broadcast-channel.ts:237

___

### removeInvokeHandler

▸ **removeInvokeHandler**(`name`, `handler`, `context?`): `void`

删除 `name`、`handler` 和 `context.audience` 匹配的 Invoke 处理器。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | 方法名 |
| `handler` | [`InvokeHandler`](../modules.md#invokehandler) | 处理器 |
| `context?` | [`BaseContext`](../interfaces/BaseContext.md) | 消息上下文 |

#### Returns

`void`

#### Defined in

src/shimo-broadcast-channel.ts:471

___

### structuredClone

▸ `Private` **structuredClone**<`T`\>(`data`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `unknown` |

#### Returns

`T`

#### Defined in

src/shimo-broadcast-channel.ts:121
