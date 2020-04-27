module.exports = function (message, perm) {
  const hasPerm = message.member.hasPermission(perm)
  if (!hasPerm) {
    message.reply('you are not authorized to use this command!')
  }
  return hasPerm
}
