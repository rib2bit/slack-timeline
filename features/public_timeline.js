module.exports = function (controller) {
  let prev0_ts = "";
  let prev1_ts = "";
  let p = 0;

  var post_message = (ts, user, channel, text, attachments, bot) => {
    // workaround for duplicated post
    if (prev0_ts === ts || prev1_ts === ts) {
      console.log("duplication!: " + ts);
      return;
    }
    if (p == 0) {
      prev0_ts = ts;
      p = 1;
    } else {
      prev1_ts = ts;
      p = 0;
    }

    bot.api.users.info({ user: user }, async (err, res) => {
      if (err) { console.log("err: ", err); return; }
      text = '<#' + channel + '> ' + (text.startsWith("&gt; ") || text.startsWith("&gt;&gt;&gt; ") || text.startsWith("• ") || text.startsWith("1. ") ? "\n" : "") + text;
      await bot.api.chat.postMessage({ text: text, channel: process.env.timelineChannelId, as_user: false, username: res.user.profile.display_name, icon_url: res.user.profile.image_48, unfurl_links: true, unfurl_media: true, attachments: attachments }, (err, res) => {
        if (err) { console.log("err: ", err); return; }
      });
    });

  };

  controller.on('file_share', function (bot, message) {
    // console.dir(message);
    // console.log("file_share ↑");

    if (message.type !== "file_share") {
      return;
    }

    message.text = message.incoming_message.channelData.text;
    let attachments = [];
    message.files.forEach((value, index) => {
      if (value.mimetype.startsWith("image/")) {
        attachments.push({
          title: value.title,
          image_url: value.url_private
        });
      } else {
        attachments.push({
          title: value.title,
          text: value.url_private
        });
      }
    });

    post_message(message.event_ts, message.user, message.channel, message.text, attachments, bot);
  });

  controller.on('message', (bot, message) => {
    // console.dir(message);
    // console.log("message ↑");

    const channel_type = message.channel_type;
    if (channel_type !== "channel") {
      console.log(channel_type);
      return;
    }

    post_message(message.event_ts, message.user, message.channel, message.text, undefined, bot);
  });
} 
