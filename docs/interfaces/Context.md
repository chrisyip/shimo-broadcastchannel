[shimo-broadcast-channel](../README.md) / [Exports](../modules.md) / Context

# Interface: Context

消息上下文。
如果在绑定 listener 时指定了 context，
则只有收到的消息的 context.audience 和 listener 的 context.audience 匹配才会将消息传递给 listener。

## Hierarchy

- [`BaseContext`](BaseContext.md)

  ↳ **`Context`**

## Table of contents

### Properties

- [audience](Context.md#audience)
- [channelId](Context.md#channelid)
- [messageId](Context.md#messageid)
- [timeout](Context.md#timeout)
- [type](Context.md#type)

## Properties

### audience

• `Optional` **audience**: `string`

消息的受众，会和 listener 的 context.audience 对比。'*' 代表任意 audience，undefined 也是一个合法的 audience。

#### Inherited from

[BaseContext](BaseContext.md).[audience](BaseContext.md#audience)

#### Defined in

src/shimo-broadcast-channel.ts:649

___

### channelId

• **channelId**: `string`

对应的频道 ID。

#### Defined in

src/shimo-broadcast-channel.ts:668

___

### messageId

• **messageId**: `string`

消息的唯一 ID。

#### Defined in

src/shimo-broadcast-channel.ts:673

___

### timeout

• `Optional` **timeout**: `number`

在 Invoke 过程中，多少 ms 之后，仍未收到结果，就会抛出 MessageTimeoutError。

#### Inherited from

[BaseContext](BaseContext.md).[timeout](BaseContext.md#timeout)

#### Defined in

src/shimo-broadcast-channel.ts:654

___

### type

• `Optional` **type**: [`ContextType`](../enums/ContextType.md)

消息的类型。

#### Defined in

src/shimo-broadcast-channel.ts:678
