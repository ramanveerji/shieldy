import { deleteMessageSafeWithBot } from '@helpers/deleteMessageSafe'
import { ContextMessageUpdate } from 'telegraf'

export async function checkLock(ctx: ContextMessageUpdate, next: () => any) {
  // If loccked, private messages or channel, then continue
  if (
    !ctx.dbchat.adminLocked ||
    ctx.chat.type === 'private' ||
    ctx.chat.type === 'channel'
  ) {
    return next()
  }
  // If super admin, then continue
  if (ctx.from.id === parseInt(process.env.ADMIN)) {
    return next()
  }
  // If from the group anonymous bot, then continue
  if (ctx.from?.username === 'GroupAnonymousBot') {
    return next()
  }
  // If from admin, then continue
  if (ctx.administrators.map((m) => m.user.id).indexOf(ctx.from.id) > -1) {
    return next()
  }
  // Otherwise, remove the message
  await deleteMessageSafeWithBot(ctx.chat.id, ctx.message.message_id)
}
