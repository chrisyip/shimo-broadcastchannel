[shimo-broadcast-channel](../README.md) / [Exports](../modules.md) / InvokeResponsePayload

# Interface: InvokeResponsePayload

Invoke 调用的响应结果

## Table of contents

### Properties

- [data](InvokeResponsePayload.md#data)
- [error](InvokeResponsePayload.md#error)

## Properties

### data

• **data**: `unknown`

Invoke 调用的响应结果

#### Defined in

src/shimo-broadcast-channel.ts:688

___

### error

• `Optional` **error**: `string` \| `Error`

Invoke 调用相应的错误，Firefox 不支持返回 Error，会转换为 string

#### Defined in

src/shimo-broadcast-channel.ts:693
