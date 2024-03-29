[shimo-broadcast-channel](../README.md) / [Exports](../modules.md) / MessageTimeoutError

# Class: MessageTimeoutError

## Hierarchy

- `Error`

  ↳ **`MessageTimeoutError`**

## Table of contents

### Constructors

- [constructor](MessageTimeoutError.md#constructor)

### Properties

- [message](MessageTimeoutError.md#message)
- [name](MessageTimeoutError.md#name)
- [stack](MessageTimeoutError.md#stack)
- [prepareStackTrace](MessageTimeoutError.md#preparestacktrace)
- [stackTraceLimit](MessageTimeoutError.md#stacktracelimit)

### Methods

- [captureStackTrace](MessageTimeoutError.md#capturestacktrace)

## Constructors

### constructor

• **new MessageTimeoutError**(`message`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Overrides

Error.constructor

#### Defined in

src/errors.ts:18

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1023

___

### name

• **name**: `string` = `'MessageTimeoutError'`

#### Overrides

Error.name

#### Defined in

src/errors.ts:16

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
