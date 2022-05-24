[shimo-broadcast-channel](../README.md) / [Exports](../modules.md) / BaseContext

# Interface: BaseContext

消息上下文。
如果在绑定 listener 时指定了 context，
则只有收到的消息的 context.audience 和 listener 的 context.audience 匹配才会将消息传递给 listener。

## Hierarchy

- **`BaseContext`**

  ↳ [`Context`](Context.md)

## Indexable

▪ [key: `string`]: `unknown`

## Table of contents

### Properties

- [audience](BaseContext.md#audience)
- [timeout](BaseContext.md#timeout)

## Properties

### audience

• `Optional` **audience**: `string`

消息的受众，会和 listener 的 context.audience 对比。

#### Defined in

src/shimo-broadcast-channel.ts:550

___

### timeout

• `Optional` **timeout**: `number`

在 Invoke 过程中，多少 ms 之后，仍未收到结果，就会抛出 MessageTimeoutError。

#### Defined in

src/shimo-broadcast-channel.ts:555
