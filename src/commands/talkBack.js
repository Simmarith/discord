module.exports = function (message, onlyPayload) {
  if (onlyPayload === '') {
    message.channel.send('You gave me nothing to say back!')
  } else {
    message.channel.send(onlyPayload)
  }
} 
