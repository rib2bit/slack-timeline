module.exports = function (controller) {

  controller.on('message', (bot, message) => {

    const channel_type = message.channel_type;
    if (channel_type !== "channel") { return }

    bot.api.users.info({ user: message.user }, async (err, res) => {
      if (err) { console.log("err: ", err); return; }
      const text = '<#' + message.channel + '> ' + message.text;
      await bot.api.chat.postMessage({ text: text, channel: process.env.timelineChannelId, as_user: false, username: res.user.profile.display_name, icon_url: res.user.profile.image_48 }, (err, res) => {
        if (err) { console.log("err: ", err); return; }
      });
    });

  });
}
