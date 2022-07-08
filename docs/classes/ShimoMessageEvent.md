[shimo-broadcast-channel](../README.md) / [Exports](../modules.md) / ShimoMessageEvent

# Class: ShimoMessageEvent

## Table of contents

### Constructors

- [constructor](ShimoMessageEvent.md#constructor)

### Properties

- [channelId](ShimoMessageEvent.md#channelid)
- [context](ShimoMessageEvent.md#context)
- [data](ShimoMessageEvent.md#data)
- [emitter](ShimoMessageEvent.md#emitter)
- [id](ShimoMessageEvent.md#id)
- [origin](ShimoMessageEvent.md#origin)
- [source](ShimoMessageEvent.md#source)
- [time](ShimoMessageEvent.md#time)

## Constructors

### constructor

• **new ShimoMessageEvent**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`MessageEventOptions`](../interfaces/MessageEventOptions.md) |

#### Defined in

src/message-event.ts:31

## Properties

### channelId

• `Readonly` **channelId**: `string`

#### Defined in

src/message-event.ts:29

___

### context

• `Readonly` **context**: [`Context`](../interfaces/Context.md)

#### Defined in

src/message-event.ts:20

___

### data

• `Readonly` **data**: `unknown`

The data sent by the message emitter.

#### Defined in

src/message-event.ts:19

___

### emitter

• `Readonly` **emitter**: `string`

#### Defined in

src/message-event.ts:28

___

### id

• `Readonly` **id**: `string`

The ID of the message.

#### Defined in

src/message-event.ts:25

___

### origin

• `Readonly` **origin**: `string`

#### Defined in

src/message-event.ts:27

___

### source

• `Readonly` **source**: `string`

#### Defined in

src/message-event.ts:26

___

### time

• `Readonly` **time**: `number`

#### Defined in

src/message-event.ts:21
