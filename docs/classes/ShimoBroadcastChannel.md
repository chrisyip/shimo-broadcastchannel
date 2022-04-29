[shimo-broadcast-channel](../README.md) / [Exports](../modules.md) / ShimoBroadcastChannel

# Class: ShimoBroadcastChannel

## Table of contents

### Constructors

- [constructor](ShimoBroadcastChannel.md#constructor)

### Properties

- [channel](ShimoBroadcastChannel.md#channel)
- [emitter](ShimoBroadcastChannel.md#emitter)
- [emitterId](ShimoBroadcastChannel.md#emitterid)
- [eventHandlers](ShimoBroadcastChannel.md#eventhandlers)
- [id](ShimoBroadcastChannel.md#id)
- [invokeHandlers](ShimoBroadcastChannel.md#invokehandlers)

### Methods

- [addEventListener](ShimoBroadcastChannel.md#addeventlistener)
- [addInvokeHandler](ShimoBroadcastChannel.md#addinvokehandler)
- [distributeMessage](ShimoBroadcastChannel.md#distributemessage)
- [emit](ShimoBroadcastChannel.md#emit)
- [handleInvokeRequest](ShimoBroadcastChannel.md#handleinvokerequest)
- [handleInvokeResponse](ShimoBroadcastChannel.md#handleinvokeresponse)
- [initMessageEvent](ShimoBroadcastChannel.md#initmessageevent)
- [invoke](ShimoBroadcastChannel.md#invoke)
- [off](ShimoBroadcastChannel.md#off)
- [on](ShimoBroadcastChannel.md#on)
- [once](ShimoBroadcastChannel.md#once)
- [postMessage](ShimoBroadcastChannel.md#postmessage)
- [removeInvokeHandler](ShimoBroadcastChannel.md#removeinvokehandler)

## Constructors

### constructor

• **new ShimoBroadcastChannel**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`Options`](../interfaces/Options.md) |

#### Defined in

src/shimo-broadcast-channel.ts:25

## Properties

### channel

• `Private` `Readonly` **channel**: `BroadcastChannel`<`any`\>

#### Defined in

src/shimo-broadcast-channel.ts:15

___

### emitter

• `Private` `Readonly` **emitter**: `TinyEmitter`

#### Defined in

src/shimo-broadcast-channel.ts:17

___

### emitterId

• `Private` `Readonly` **emitterId**: `string`

#### Defined in

src/shimo-broadcast-channel.ts:23

___

### eventHandlers

• `Private` `Readonly` **eventHandlers**: `Map`<`string`, [[`EventHandler`](../modules.md#eventhandler)<`unknown`\>, Context?][]\>

#### Defined in

src/shimo-broadcast-channel.ts:21

___

### id

• `Readonly` **id**: `string`

#### Defined in

src/shimo-broadcast-channel.ts:13

___

### invokeHandlers

• `Private` `Readonly` **invokeHandlers**: `Map`<`string`, `InvokeInternalHandler`[]\>

#### Defined in

src/shimo-broadcast-channel.ts:19

## Methods

### addEventListener

▸ `Private` **addEventListener**(`name`, `listener`, `context?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `listener` | [`EventHandler`](../modules.md#eventhandler)<`unknown`\> |
| `context?` | [`Context`](../interfaces/Context.md) |

#### Returns

`void`

#### Defined in

src/shimo-broadcast-channel.ts:80

___

### addInvokeHandler

▸ **addInvokeHandler**(`name`, `handler`, `context?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `handler` | [`InvokeHandler`](../modules.md#invokehandler) |
| `context?` | [`Context`](../interfaces/Context.md) |

#### Returns

`void`

#### Defined in

src/shimo-broadcast-channel.ts:332

___

### distributeMessage

▸ **distributeMessage**(`messageEvent`): `Promise`<`void`\>

在当前 channel 实例里分发消息，不会分发到其它 channel 实例。
用于类似 cross-origin iframe 之间的通信。

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `messageEvent` | `ShimoMessageEvent` | 消息 |

#### Returns

`Promise`<`void`\>

#### Defined in

src/shimo-broadcast-channel.ts:209

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

src/shimo-broadcast-channel.ts:147

___

### handleInvokeRequest

▸ `Private` **handleInvokeRequest**(`messageEvent`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageEvent` | `ShimoMessageEvent` |

#### Returns

`Promise`<`void`\>

#### Defined in

src/shimo-broadcast-channel.ts:230

___

### handleInvokeResponse

▸ `Private` **handleInvokeResponse**(`messageEvent`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageEvent` | `ShimoMessageEvent` |

#### Returns

`void`

#### Defined in

src/shimo-broadcast-channel.ts:267

___

### initMessageEvent

▸ `Private` **initMessageEvent**(`input`): `ShimoMessageEvent`

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | { `context?`: [`Context`](../interfaces/Context.md) ; `data`: `unknown` ; `origin?`: `string` ; `time?`: `number`  } \| `ShimoMessageEvent` |

#### Returns

`ShimoMessageEvent`

#### Defined in

src/shimo-broadcast-channel.ts:65

___

### invoke

▸ **invoke**<`T`\>(`name`, `args`, `context?`): `Promise`<`T`\>

发出一条 Invoke 消息，并等待返回结果
Invoke 消息并不会被监听，只会被发送到 channel 中通过 addInvokeHandler 添加的 handler 中。

**`parma`** name 方法名

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | - |
| `args` | `unknown`[] | 参数列表 |
| `context?` | [`Context`](../interfaces/Context.md) | 消息上下文 |

#### Returns

`Promise`<`T`\>

#### Defined in

src/shimo-broadcast-channel.ts:285

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
| `context?` | [`Context`](../interfaces/Context.md) | 监听的消息的上下文，传了则只取消相同上下文 audience 的监听器 |

#### Returns

`void`

#### Defined in

src/shimo-broadcast-channel.ts:132

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
| `context?` | [`Context`](../interfaces/Context.md) | 监听的消息的上下文，传了则只会收到相同上下文 audience 的消息 |

#### Returns

[`OffEventCallback`](../modules.md#offeventcallback)

#### Defined in

src/shimo-broadcast-channel.ts:96

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

src/shimo-broadcast-channel.ts:111

___

### postMessage

▸ **postMessage**(`message`, `context?`): `Promise`<`void`\>

发出一条消息到 channel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `unknown` | 消息 |
| `context?` | [`Context`](../interfaces/Context.md) | 消息的上下文，传了则只有相同上下文 audience 的监听器才能收到消息 |

#### Returns

`Promise`<`void`\>

#### Defined in

src/shimo-broadcast-channel.ts:166

___

### removeInvokeHandler

▸ **removeInvokeHandler**(`name`, `handler`, `context?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `handler` | [`InvokeHandler`](../modules.md#invokehandler) |
| `context?` | [`Context`](../interfaces/Context.md) |

#### Returns

`void`

#### Defined in

src/shimo-broadcast-channel.ts:341
