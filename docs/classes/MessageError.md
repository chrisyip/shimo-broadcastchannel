[shimo-broadcast-channel](../README.md) / [Exports](../modules.md) / MessageError

# Class: MessageError

## Hierarchy

- `Error`

  ↳ **`MessageError`**

## Table of contents

### Constructors

- [constructor](MessageError.md#constructor)

### Properties

- [context](MessageError.md#context)
- [message](MessageError.md#message)
- [name](MessageError.md#name)
- [originMessage](MessageError.md#originmessage)
- [stack](MessageError.md#stack)
- [prepareStackTrace](MessageError.md#preparestacktrace)
- [stackTraceLimit](MessageError.md#stacktracelimit)

### Methods

- [captureStackTrace](MessageError.md#capturestacktrace)

## Constructors

### constructor

• **new MessageError**(`message`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Overrides

Error.constructor

#### Defined in

src/errors.ts:8

## Properties

### context

• **context**: [`Context`](../interfaces/Context.md)

#### Defined in

src/errors.ts:6

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1023

___

### name

• **name**: `string` = `'MessageError'`

#### Overrides

Error.name

#### Defined in

src/errors.ts:4

___

### originMessage

• **originMessage**: `unknown`

#### Defined in

src/errors.ts:5

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1024

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`see`** https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
