class RoleManager {

  constructor() {
    this.queue = []
  }

  addRole(user, role) {
    this.queue.push({
      type: 'add',
      user,
      role
    })
    this.clearQueue()
  }

  removeRole(user, role) {
    const toRemove = () => {
      this.queue.push({
        type: 'remove',
        user,
        role
      })
      this.clearQueue()
    }
    setTimeout(toRemove.bind(this), 1000)
  }

  changeRoles(user, diff) {
    this.queue.push({
      type: 'diff',
      user,
      diff
    })
    this.clearQueue()
  }

  clearQueue() {
    if (this.isProcessing) {
      return
    }
    this.isProcessing = true
    this.removeRecursively()
  }

  async removeRecursively() {
    try {
      if (this.queue.length !== 0) {
        const roleChange = this.queue.shift()
        // eslint-disable-next-line
        roleChange.user = await roleChange.user.fetch(true)

        switch (roleChange.type) {
          case 'add':
            await roleChange.user.roles.add(roleChange.role)
            break
          case 'remove':
            await roleChange.user.roles.remove(roleChange.role)
            break
          case 'diff':
            let roles = roleChange.user.roles.cache.array().map(role => role.id)
            roleChange.diff.add.forEach(role => {
              roles.push(role)
            })
            roles = roles.filter(role => roleChange.diff.remove.indexOf(role) === -1)
            await roleChange.user.roles.set(roles)
            break
          default:
        } 
        setTimeout(this.removeRecursively.bind(this), 1000)
      } else {
        this.isProcessing = false
      }
    } catch(e) {
      console.warn(e)
      this.isProcessing = false
    }
  }

}

module.exports = new RoleManager()
