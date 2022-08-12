var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-commands",
  category: "💪 Setup",
  aliases: ["setupcommands", "setup-command", "setupcommand"],
  cooldown: 5,
  usage: "setup-commands  -->  Follow the Steps",
  description: "Enable/Disable specific Commands",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      function getMenuOptions() {
        return [
          {
            label: "ECONOMY",
            value: "ECONOMY",
            emoji: "💸",
            description: `${client.settings.get(message.guild.id, "ECONOMY") ? "❌ Disable ECONOMY Commands" : "✅ Enable ECONOMY Commands"}`
          },
          {
            label: "SCHOOL",
            value: "SCHOOL",
            emoji: "🏫",
            description: `${client.settings.get(message.guild.id, "SCHOOL") ? "❌ Disable SCHOOL Commands" : "✅ Enable SCHOOL Commands"}`
          },
          {
            label: "MUSIC",
            value: "MUSIC",
            emoji: "🎶",
            description: `${client.settings.get(message.guild.id, "MUSIC") ? "❌ Disable Music Commands" : "✅ Enable Music Commands"}`
          },
          {
            label: "FILTER",
            value: "FILTER",
            emoji: "👀",
            description: `${client.settings.get(message.guild.id, "FILTER") ? "❌ Disable FILTER Commands" : "✅ Enable FILTER Commands"}`
          },
          {
            label: "CUSTOMQUEUE",
            value: "CUSTOMQUEUE",
            emoji: "⚜️",
            description: `${client.settings.get(message.guild.id, "CUSTOMQUEUE") ? "❌ Disable CUSTOM-QUEUE Commands" : "✅ Enable CUSTOM-QUEUE Commands"}`
          },
          {
            label: "PROGRAMMING",
            value: "PROGRAMMING",
            emoji: "⌨️",
            description: `${client.settings.get(message.guild.id, "PROGRAMMING") ? "❌ Disable PROGRAMMING Commands" : "✅ Enable PROGRAMMING Commands"}`
          },
          {
            label: "RANKING",
            value: "RANKING",
            emoji: "📈",
            description: `${client.settings.get(message.guild.id, "RANKING") ? "❌ Disable RANKING Commands" : "✅ Enable RANKING Commands"}`
          },
          {
            label: "SOUNDBOARD",
            value: "SOUNDBOARD",
            emoji: "🔊",
            description: `${client.settings.get(message.guild.id, "SOUNDBOARD") ? "❌ Disable SOUNDBOARD Commands" : "✅ Enable SOUNDBOARD Commands"}`
          },
          {
            label: "VOICE",
            value: "VOICE",
            emoji: "🎤",
            description: `${client.settings.get(message.guild.id, "VOICE") ? "❌ Disable VOICE Commands" : "✅ Enable VOICE Commands"}`
          },
          {
            label: "FUN",
            value: "FUN",
            emoji: "🕹️",
            description: `${client.settings.get(message.guild.id, "FUN") ? "❌ Disable FUN Commands" : "✅ Enable FUN Commands"}`
          },
          {
            label: "MINIGAMES",
            value: "MINIGAMES",
            emoji: "🎮",
            description: `${client.settings.get(message.guild.id, "MINIGAMES") ? "❌ Disable MINIGAMES Commands" : "✅ Enable MINIGAMES Commands"}`
          },
          {
            label: "ANIME",
            value: "ANIME",
            emoji: "😳",
            description: `${client.settings.get(message.guild.id, "ANIME") ? "❌ Disable ANIME Commands" : "✅ Enable ANIME Commands"}`
          },
          {
            label: "NSFW",
            value: "NSFW",
            emoji: "🔞",
            description: `${client.settings.get(message.guild.id, "NSFW") ? "❌ Disable NSFW Commands" : "✅ Enable NSFW Commands"}`
          },
        ];
      }
      function getMenuRowComponent() { 
        let menuOptions = getMenuOptions();
        let menuSelection = new MessageSelectMenu()
          .setCustomId("MenuSelection")
          .setPlaceholder("Click: enable/disable Command-Categories")
          .setMinValues(1)
          .setMaxValues(menuOptions.length)
          .addOptions(menuOptions.filter(Boolean))
        return [new MessageActionRow().addComponents(menuSelection)]
      }


      let embed = new Discord.MessageEmbed()
        .setTitle(`Setup the allowed/not-allowed Command-Categories of this Server`)
        .setColor(es.color)
        .setDescription(`**In the selection down below all Categories are listed**\n\n**Select it to either disable/enable it!**\n\n**You can select all (*at least 1*) Command-Categories if you want to disable/enable all of them at once!**`)

       //Send message with buttons
      let msg = await message.reply({   
        embeds: [embed], 
        components: getMenuRowComponent()
      });
      const collector = msg.createMessageComponentCollector({filter: (i) => i?.isSelectMenu() && i?.user && i?.message.author.id == client.user.id, time: 180e3, max: 1 });
      collector.on("collect", async b => {
        if(b?.user.id !== message.author.id)
        return b?.reply({content: ":x: Only the one who typed the Command is allowed to select Things!", ephemeral: true});
     
        let enabled = 0, disabled = 0;
        for(const value of b?.values) {
          let oldstate = client.settings.get(message.guild.id, `${value.toUpperCase()}`);
          if(!oldstate) enabled++;
          else disabled++;
          client.settings.set(message.guild.id, !oldstate, `${value.toUpperCase()}`)
        }
        b?.reply(`<a:yes_animated:1007611220842528799> **\`Enabled ${enabled} Command-Categories\` and \`Disabled ${disabled} Command-Categories\` out of \`${b?.values.length} selected Command-Categories\`**`)
      })
      collector.on('end', collected => {
        msg.edit({content: ":x: Time ran out/Input finished! Cancelled", embeds: [
          msg.embeds[0]
            .setDescription(`${getMenuOptions().map(option => `> ${option.emoji} **${option.value}-Commands**: ${option.description.split(" ")[0] != "❌" ? `\`Are now disabled [❌]\`` : `\`Are now enabled [✅]\``}`).join("\n\n")}`)
        ], components: []}).catch((e)=>{})
      });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-commands"]["variable5"]))
      ]});
    }
  },
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
function getNumberEmojis() {
  return [
    "<:Number_0:1007438438137614356>",
    "<:Number_1:1007438539681706024>",
    "<:Number_2:1007438622837985381>",
    "<:Number_3:1007438687627391048>",
    "<:Number_4:1007438820096081920>",
    "<:Number_5:1007438939436625980>",
    "<:Number_6:1007439048811499652>",
    "<:Number_7:1007439121653973036>",
    "<:Number_8:1007439171243216917>",
    "<:Number_9:1007439224791892008>",
    "<:Number_10:1007439294232793190>",
    "<:Number_11:1007439385664426065>",
    "<:Number_12:1007441842939371590>",
    "<:Number_13:1007441886971183134>",
    "<:Number_14:1007441938380759131>",
    "<:Number_15:1007442236784509018>",
    "<:Number_16:1007442265431613460>",
    "<:Number_17:1007442287837593672>",
    "<:Number_18:1007442316564369418>",
    "<:Number_19:1007442337137438811>",
    "<:Number_20:1007442361586036777>",
    "<:Number_21:1007442391663378462>",
    "<:Number_22:1007442413868036167>",
    "<:Number_23:1007442439285522532>",
    "<:Number_24:1007442464212262912>",
    "<:Number_25:1007442500681740309>"
  ]
}
