[shimo-broadcast-channel](README.md) / Exports

# shimo-broadcast-channel

## Table of contents

### Enumerations

- [ContextType](enums/ContextType.md)

### Classes

- [InvokeError](classes/InvokeError.md)
- [MessageError](classes/MessageError.md)
- [MessageTimeoutError](classes/MessageTimeoutError.md)
- [ShimoBroadcastChannel](classes/ShimoBroadcastChannel.md)
- [ShimoMessageEvent](classes/ShimoMessageEvent.md)

### Interfaces

- [BaseContext](interfaces/BaseContext.md)
- [Context](interfaces/Context.md)
- [InvokeResponsePayload](interfaces/InvokeResponsePayload.md)
- [MessageEventOptions](interfaces/MessageEventOptions.md)
- [Options](interfaces/Options.md)

### Type aliases

- [EventHandler](modules.md#eventhandler)
- [Events](modules.md#events)
- [InvokeHandler](modules.md#invokehandler)
- [MessagePoster](modules.md#messageposter)
- [OffEventCallback](modules.md#offeventcallback)
- [OnMessageArrive](modules.md#onmessagearrive)

### Variables

- [DEBUG\_NAMESPACE](modules.md#debug_namespace)
- [INVOKE\_DEFAUTL\_TIMEOUT](modules.md#invoke_defautl_timeout)
- [SOURCE\_NAMESPACE](modules.md#source_namespace)

### Functions

- [isShimoMessageEventLike](modules.md#isshimomessageeventlike)
- [structuredClone](modules.md#structuredclone)

## Type aliases

### EventHandler

Ƭ **EventHandler**<`T`\>: (`payload`: `T`, `context?`: [`Context`](interfaces/Context.md)) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Type declaration

▸ (`payload`, `context?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `T` |
| `context?` | [`Context`](interfaces/Context.md) |

##### Returns

`void`

#### Defined in

src/shimo-broadcast-channel.ts:515

___

### Events

Ƭ **Events**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `error` | [`MessageError`](classes/MessageError.md) | - |
| `invokeResponse` | `unknown` | - |
| `message` | [`ShimoMessageEvent`](classes/ShimoMessageEvent.md) | Channel 收到消息时触发的事件 |
| `messageError` | [`MessageError`](classes/MessageError.md) | 当 channel 收到无法处理的消息时触发的事件 |
| `postMessage` | [`ShimoMessageEvent`](classes/ShimoMessageEvent.md) | postMessage 事件，当消息通过 channel 发出后，会触发 |

#### Defined in

src/shimo-broadcast-channel.ts:494

___

### InvokeHandler

Ƭ **InvokeHandler**: (...`args`: `any`[]) => `Promise`<`unknown`\>

#### Type declaration

▸ (...`args`): `Promise`<`unknown`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`Promise`<`unknown`\>

#### Defined in

src/shimo-broadcast-channel.ts:524

___

### MessagePoster

Ƭ **MessagePoster**: (`message`: [`ShimoMessageEvent`](classes/ShimoMessageEvent.md)) => `void`

#### Type declaration

▸ (`message`): `void`

用于发送消息的 poster，在 `channel.postMessage()` 时会调用，用于实现 cross-origin iframe 通信功能。

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`ShimoMessageEvent`](classes/ShimoMessageEvent.md) |

##### Returns

`void`

#### Defined in

src/shimo-broadcast-channel.ts:491

___

### OffEventCallback

Ƭ **OffEventCallback**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

src/shimo-broadcast-channel.ts:522

___

### OnMessageArrive

Ƭ **OnMessageArrive**: (`event`: [`ShimoMessageEvent`](classes/ShimoMessageEvent.md)) => `Promise`<[`ShimoMessageEvent`](classes/ShimoMessageEvent.md) \| `undefined`\>

#### Type declaration

▸ (`event`): `Promise`<[`ShimoMessageEvent`](classes/ShimoMessageEvent.md) \| `undefined`\>

消息到达时的回调函数，在消息正式分发前被调用，也会影响到 `invoke()`。
返回 undefined 时，消息将会被抛弃。
一般用于消息去重。

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`ShimoMessageEvent`](classes/ShimoMessageEvent.md) |

##### Returns

`Promise`<[`ShimoMessageEvent`](classes/ShimoMessageEvent.md) \| `undefined`\>

#### Defined in

src/shimo-broadcast-channel.ts:22

## Variables

### DEBUG\_NAMESPACE

• `Const` **DEBUG\_NAMESPACE**: ``"SM_CHANNEL"``

#### Defined in

src/debug.ts:3

___

### INVOKE\_DEFAUTL\_TIMEOUT

• `Const` **INVOKE\_DEFAUTL\_TIMEOUT**: ``60000``

#### Defined in

src/shimo-broadcast-channel.ts:15

___

### SOURCE\_NAMESPACE

• `Const` **SOURCE\_NAMESPACE**: ``"ShimoBroadcastChannel"``

#### Defined in

src/constants.ts:1

## Functions

### isShimoMessageEventLike

▸ **isShimoMessageEventLike**(`input`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `unknown` |

#### Returns

`boolean`

#### Defined in

src/message-event.ts:98

___

### structuredClone

▸ **structuredClone**(`value`, `options?`): `unknown`

Opinionated structuredClone() method.
Transferring values are not supported for now.
Errors will be converted to strings, as Firefox does not yet support sending error type.

https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |
| `options` | `Object` |
| `options.replacer?` | (`value`: `unknown`) => `unknown` |

#### Returns

`unknown`

#### Defined in

src/structured-clone.ts:22
