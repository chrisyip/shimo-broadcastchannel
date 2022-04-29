[shimo-broadcast-channel](../README.md) / [Exports](../modules.md) / InvokeError

# Class: InvokeError

## Hierarchy

- `Error`

  ↳ **`InvokeError`**

## Table of contents

### Constructors

- [constructor](InvokeError.md#constructor)

### Properties

- [arguments](InvokeError.md#arguments)
- [message](InvokeError.md#message)
- [method](InvokeError.md#method)
- [name](InvokeError.md#name)
- [stack](InvokeError.md#stack)
- [prepareStackTrace](InvokeError.md#preparestacktrace)
- [stackTraceLimit](InvokeError.md#stacktracelimit)

### Methods

- [captureStackTrace](InvokeError.md#capturestacktrace)

## Constructors

### constructor

• **new InvokeError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

Error.constructor

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1028

## Properties

### arguments

• **arguments**: `unknown`[]

#### Defined in

src/errors.ts:14

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1023

___

### method

• **method**: `string`

#### Defined in

src/errors.ts:13

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1022

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
