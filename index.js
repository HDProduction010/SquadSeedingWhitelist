const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Partials,
} = require("discord.js");
const { Sequelize, DataTypes, Op } = require("sequelize");
const http = require("http");

const host = "";
const port = ;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.GuildMember],
});

const sequelize = new Sequelize(
  ""
);

const DiscordLinkup = sequelize.define(
  "DiscordLinkup",
  {
    discordID: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    discordTag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    steamID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buddyIDs: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    patreonTier: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    adminTier: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

//tier1, tier2, ...
//Replace these with your actual roles
const buddyCount = {
  "1156638921594245195": 7,
  "1156638899234410577": 2,
  "1156638881123422329": 1,
  "1151198813747417190": 1,
  "1284703388478472202": 3,
  "982896798278500352": 0,
  "1085327690162262076": 0,
  "1085190098431246378": 0,
  "1151198813747417189": 0,
  "983158506972647424": 0,
  "1156638843261427742": 0,
  "1154598342236582001": 0,
  "1155613830487998575": 0,
  "1179229617031233678": 0,
  "1296264554812014676": 0,
  "1278071611198799942": 0,
  "1278071639820468224": 0
};

//beter not accidentaly put the wrong id in here, replace with your roles
const adminIDs = new Set(["1151198813747417189", "1151198813747417190", "1300544481665355866"]);

//replace with your roles
const reverseID = {
  0: "No Patreon registration found",
  "1284703388478472202": "Sister Community",
  "1151198813747417189": "Junior Admin",
  "1151198813747417190": "Admin",
  "1156638843261427742": "Enthusiast",
  "1156638881123422329": "Elite Player",
  "1156638899234410577": "Master Strategist",
  "1156638921594245195": "Mega Supporter",
  "1154598342236582001": "Discord Booster",
  "1155613830487998575": "Donator",
  "1296264554812014676": "Basic Whitelist",
  "1300544481665355866": "Honorary Admin",
  "1179229617031233678": "CameraMan",
  "1278071611198799942": "Commander",
  "1278071639820468224": "SquadLeader"
};

async function authenticateAndSyncWithDB() {
  try {
    await sequelize.authenticate();
    await DiscordLinkup.sync();
    console.log(
      "Connection has been established successfully and database has been synchronized."
    );
  } catch (error) {
    console.error("Unable to connect or synchronize to the database:", error);
  }
}
authenticateAndSyncWithDB();

function getSupportTier(roleCache) {
  const roleIDs = roleCache.map((role) => role.id);
  const adminID = roleIDs.filter((value) => adminIDs.has(value));
  for (const key of Object.keys(buddyCount)) {
    if (roleIDs.includes(key)) {
      return {
        maxBuddies: buddyCount[key],
        tier: key,
        adminTier: adminID.length == 1 ? adminID[0] : 0,
      };
    }
  }
  return {
    maxBuddies: 0,
    tier: 0,
    adminTier: 0,
  };
  /* //old version
  for (const myRole of roleIDs) {
    if (buddyCount.hasOwnProperty(myRole)) {
      tier = myRole;
      if (buddyCount[myRole] > maxBuddies) {
        maxBuddies = buddyCount[myRole];
      }
    }
  }
  return { maxBuddies: maxBuddies, tier: tier };
*/
}
let log_channel;
client.on("ready", async () => {
  console.log("Bot is now activated");
  // Replace your log channel
  log_channel = await client.channels.fetch("1181491753291878451");
  //postInitialMessage_patreon("1151198815190257694")
 // postInitialMessage_general("1151198814632431714")
  // postInitialMessage_admin("1174376190434357338")
});

async function postInitialMessage_patreon(channelid) {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("viewStatus")
      .setLabel("Check Patreon Status")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("editSteamID")
      .setLabel("Add personal Steam64 ID")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("editBuddySteamIDs")
      .setLabel("Add buddy whitelists")
      .setStyle(ButtonStyle.Success)
  );
// Edit embed to your liking, use discohook if you are stuck
  const mychannel = await client.channels.fetch(channelid);
  await mychannel.send({
    content: null,
    embeds: [
      {
        title: "SERVER WHITELIST PANEL",
        description:
          "> <@&1151198813726457971>\n> <@&1156638921594245195>\n> <@&1156638899234410577>\n> <@&1156638881123422329>\n```\n/ / / / / / /    IMPORTANT    / / / / / / /\n\nYou must link Steam64 ID to your Discord account in order for whitelist to work.\n\nLoss of privilege or access to this channel will invalidate whitelisting.\n\nClick 'Add personal Steam64 ID' to begin.\n\n/ / / / / / /    IMPORTANT    / / / / / / /\n```\n*IMAGE: How to add find Steam64 ID on Steam*",
        color: 16023551,
        author: {
          name: "CREDENTIALS SUBMISSION     |    WHITELIST",
        },
        image: {
          url: "https://cdn.discordapp.com/attachments/715413949197058048/1156696096488296518/image1.jpg?ex=6515e8af&is=6514972f&hm=50c5bb047d6749d4ebca76faf49898e41173704b3afa4638e31506bfe6a1336e&",
        },
      },
    ],
    attachments: [],
    components: [row],
  });
}

async function postInitialMessage_general(channelid) {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setURL("http://patreon.com/auth/discord/connect")
      .setLabel("Link Patreon to Discord (log-in required)")
      .setStyle(ButtonStyle.Link),
    new ButtonBuilder()
      .setCustomId("viewStatus")
      .setLabel("Check Patreon Status")
      .setStyle(ButtonStyle.Success)
  );
  
// Edit embed to your liking, use discohook if you are stuck
  const mychannel = await client.channels.fetch(channelid);
  await mychannel.send({
    content: null,
    embeds: [
      {
        color: 16023551,
        author: {
          name: "Patreon Status    |    SoF Supporter",
        },
        footer: {
          text: "In order to redeem your patreon privleges you must link your account to your discord using your Steam64ID.\n\nBy linking your Discord, you gain patreon perks and benifits! If you have buddy whitelists this is where you will enter that information in to gain access. FOR JOIN MESSAGES PLEASE CONTACT HD!\n\nPlease contact SoF if you encounter any issues linking your account.",
        },
        image: {
          url: "https://cdn.discordapp.com/attachments/715413949197058048/1156699277062586518/image.png?ex=6515eba6&is=65149a26&hm=f3caede65a8825a9026444a87f06f61f770fa1df4cc1135474b6d5235b20bc44&",
        },
      },
    ],
    author: "ðŸ—…",
    avatar_url:
      "https://cdn.discordapp.com/attachments/1126929753102880768/1154947759921705081/show.png?ex=65157b2b&is=651429ab&hm=681d52b76349a16daca261b069e6b9ed1e407fb71f7a154a5f919fd353d99557&",
    attachments: [],
    components: [row],
  });
}

async function postInitialMessage_admin(channelid) {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("viewStatus")
      .setLabel("Check Admin Status")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("editSteamID")
      .setLabel("Add personal Steam64 ID")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("editBuddySteamIDs")
      .setLabel("Add buddy whitelists")
      .setStyle(ButtonStyle.Success)
  );
// Edit embed to your liking, use discohook if you are stuck
  const mychannel = await client.channels.fetch(channelid);
  await mychannel.send({
    content: null,
    embeds: [
      {
        title: "SERVER ADMIN PERMISSIONS PANEL",
        description:
          "> <@&1151198813747417190>\n> <@&1151198813747417189>\n\n```\n/ / / / / / /    IMPORTANT    / / / / / / /\n\nYou must link Steam64 ID to your Discord account to activate admin permissions.\n\nAdminCam, AdminChat, and Whitelist privileges are tied to your Steam64 ID.\n\nIn-game admin commands functions are accessed through AdminChat.\n\nAll external admin command functions are accessed through Battlemetrics.\n\nToggling to 'Inactive' role invalidates admin permissions automatically.\n\nClick 'Add admin Steam64 ID' to begin.\n\n/ / / / / / /    IMPORTANT    / / / / / / /\n```\n> <@&1151198813747417190> are granted one buddy whitelist",
        color: 16711680,
        author: {
          name: "CREDENTIALS SUBMISSION     |    ADMINISTRATOR",
        },
        image: {
          url: "https://cdn.discordapp.com/attachments/1017348811267518464/1101056182283669504/400x1-image-discord-grey.png",
        },
      },
    ],
    attachments: [],
    components: [row],
  });
}

client.on(Events.GuildMemberRemove, async (member) => {
  await DiscordLinkup.upsert({
    discordID: member.user.id,
    discordTag: member.user.tag,
    patreonTier: "0",
    adminTier: "0",
  });
});

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  const newSupport = getSupportTier(newMember.roles.cache);
  //console.log(newMember);
  await DiscordLinkup.upsert({
    discordID: newMember.user.id,
    discordTag: newMember.user.tag,
    patreonTier: newSupport.tier,
    adminTier: newSupport.adminTier,
  });
});

// edit your steamID
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId == "editSteamID") {
    //console.log(interaction);

    const modal = new ModalBuilder()
      .setCustomId("editSteamIDModal")
      .setTitle("Your Steam64ID");

    const result = await DiscordLinkup.findOne({
      where: { discordID: interaction.member.user.id },
    });

    const steamIDinput = new TextInputBuilder()
      .setCustomId("UserSteamID")
      .setLabel("What's your Steam64ID?")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(17)
      //.setMinLength(17)
      .setRequired(true)
      .setValue(result && result.steamID ? result.steamID : "");

    const firstActionRow = new ActionRowBuilder().addComponents(steamIDinput);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId === "editSteamIDModal") {
    if (
      !/^7656[0-9]{13}$/.test(
        interaction.fields.getTextInputValue("UserSteamID")
      )
    ) {
      console.log(
        "invalid steamID: " +
          interaction.fields.getTextInputValue("UserSteamID")
      );
      await interaction.reply({
        content: `Invalid SteamID: \`${interaction.fields.getTextInputValue(
          "UserSteamID"
        )}\`, please verify the correctness of the steamID or create a ticket.`,
        ephemeral: true,
      });
      return;
    }
    //is valid steam id
    await interaction.reply({
      content: `Linked steamID: \`${interaction.fields.getTextInputValue(
        "UserSteamID"
      )}\` to user: \`${interaction.member.user.tag}\``,
      ephemeral: true,
    });
    const roleInfo = getSupportTier(interaction.member.roles.cache);
    DiscordLinkup.upsert({
      discordID: interaction.member.user.id,
      discordTag: interaction.member.user.tag,
      steamID: interaction.fields.getTextInputValue("UserSteamID"),
      patreonTier: roleInfo.tier,
      adminTier: roleInfo.adminTier,
    });
    await log_channel.send({
      content:
        `Linked steamID: \`${interaction.fields.getTextInputValue(
          "UserSteamID"
        )}\` to user: \`${interaction.member.user.tag}\`, Patreon status: \`${
          reverseID[roleInfo.tier]
        }\`` +
        (roleInfo.adminTier
          ? `, Admin status: \`${reverseID[roleInfo.adminTier]}\``
          : ""),
    });
  }
});

//edit buddy steamIDs
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId == "editBuddySteamIDs") {
    //console.log(interaction);
    const roleInfo = getSupportTier(interaction.member.roles.cache);
    if (roleInfo.maxBuddies == 0) {
      await interaction.reply({
        content:
          "You are not a Patreon supporter" +
          (roleInfo.adminTier ? "/Admin" : "") +
          " of sufficient tier to have buddies.",
        ephemeral: true,
      });
      return;
    }
    const result = await DiscordLinkup.findOne({
      where: { discordID: interaction.member.user.id },
    });
    const buddies = result ? JSON.parse(result.buddyIDs) : null;

    const steamIDinput = (num, word) => {
      const singleField = new TextInputBuilder()
        .setCustomId(`buddy${num}SteamID`)
        .setLabel(`What's your ${word} buddies Steam64ID?`)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(17)
        .setRequired(false)
        .setValue(buddies != null && buddies[num - 1] ? buddies[num - 1] : "");

      return new ActionRowBuilder().addComponents(singleField);
    };

    const steamIDLargeInput = () => {
      const largeField = new TextInputBuilder()
        .setCustomId("buddyLargeSteamID")
        .setLabel("Please enter your buddies Steam64IDs:")
        .setPlaceholder(
          "11111111111111111, 22222222222222222, 33333333333333333"
        )
        .setValue(
          buddies != null ? String(buddies.slice(0, roleInfo.maxBuddies)) : ""
        )
        .setRequired(false)
        .setMaxLength(1000)
        .setStyle(TextInputStyle.Paragraph);

      return new ActionRowBuilder().addComponents(largeField);
    };

    const modal = new ModalBuilder()
      .setCustomId("editBuddySteamIDModal")
      .setTitle("Your buddies Steam64IDs");

    const componets = [];
    const num_to_word = {
      1: "first",
      2: "second",
      3: "third",
      4: "fourth",
      5: "fifth",
    };
    if (roleInfo.maxBuddies > 5) {
      componets.push(steamIDLargeInput());
    } else {
      for (let i = 1; i <= roleInfo.maxBuddies; i++) {
        componets.push(steamIDinput(i, num_to_word[i]));
      }
    }

    modal.addComponents(...componets);
    await interaction.showModal(modal);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId === "editBuddySteamIDModal") {
    //console.log(interaction)
    let buddies = [];
    const roleInfo = getSupportTier(interaction.member.roles.cache);
    if (roleInfo.maxBuddies > 5) {
      const inputValue =
        interaction.fields.getTextInputValue("buddyLargeSteamID");
      let numbers = inputValue.match(/\d+/g);
      if (numbers === null) numbers = [];
      buddies = inputValue.match(/(7656[0-9]{13})+/g);
      if (buddies === null) buddies = [];
      const difference = numbers.filter((x) => !buddies.includes(x));
      if (difference.length > 0) {
        console.log("invalid steamID buddies: " + difference);
        await interaction.reply({
          content: `Invalid SteamID(s): \`${difference}\`, please verify the correctness of the steamID(s), leave the input field empty or create a ticket. Your input: \`${inputValue}\`.`,
          ephemeral: true,
        });
        return;
      }
      if (buddies.length > roleInfo.maxBuddies) {
        console.log("Too many Buddies");
        await interaction.reply({
          content: `You entered more buddies (\`${buddies.length}\`) than your Patreon tier supports (\`${roleInfo.maxBuddies}\`). Your input: \`${inputValue}\`.`,
          ephemeral: true,
        });
        return;
      }
      console.log(numbers);
      console.log(buddies);
    } else {
      for (let i = 1; i <= roleInfo.maxBuddies; i++) {
        if (
          !/^(|7656[0-9]{13})$/.test(
            interaction.fields.getTextInputValue(`buddy${i}SteamID`)
          )
        ) {
          console.log(
            "invalid steamID buddy: " +
              interaction.fields.getTextInputValue(`buddy${i}SteamID`)
          );
          await interaction.reply({
            content: `Invalid SteamID: \`${interaction.fields.getTextInputValue(
              `buddy${i}SteamID`
            )}\`, please verify the correctness of the steamID, leave the input field empty or create a ticket.`,
            ephemeral: true,
          });
          return;
        }
        if (interaction.fields.getTextInputValue(`buddy${i}SteamID`) != "") {
          buddies.push(
            interaction.fields.getTextInputValue(`buddy${i}SteamID`)
          );
        }
      }
    }
    await interaction.reply({
      content:
        buddies.length > 0
          ? `Your buddie(s) are now: \`${buddies}\`.`
          : "You have no buddies.",
      ephemeral: true,
    });
    DiscordLinkup.upsert({
      discordID: interaction.member.user.id,
      discordTag: interaction.member.user.tag,
      buddyIDs: buddies.length > 0 ? buddies : null,
      patreonTier: roleInfo.tier,
      adminTier: roleInfo.adminTier,
    });
    await log_channel.send({
      content: `Linked buddy steamIDs: \`${
        buddies.length > 0 ? buddies : "None"
      }\` to user: \`${interaction.member.user.tag}\`, Patreon status: \`${
        reverseID[roleInfo.tier]
      }\``,
    });
  }
});

//view status
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId == "viewStatus") {
    const roleInfo = getSupportTier(interaction.member.roles.cache);
    const result = await DiscordLinkup.findOne({
      where: { discordID: interaction.member.user.id },
    });
    let buddies = result ? JSON.parse(result.buddyIDs) : null;
    if (buddies != null) {
      buddies = buddies.slice(0, roleInfo.maxBuddies);
    }
    buddies = buddies != null && buddies.length > 0 ? buddies : null;
    await interaction.reply({
      content:
        (roleInfo.adminTier
          ? `Admin Status: \`${reverseID[roleInfo.adminTier]}\`, `
          : "") +
        `Role status: \`${reverseID[roleInfo.tier]}\`, User: \`${
          interaction.member.user.tag
        }\`, steamID: \`${
          result && result.steamID ? result.steamID : "Not set yet"
        }\`, Buddies: \`${buddies ? buddies : "None"}\``,
      ephemeral: true,
    });
    await DiscordLinkup.upsert({
      discordID: interaction.member.user.id,
      discordTag: interaction.member.user.tag,
      patreonTier: roleInfo.tier,
      adminTier: roleInfo.adminTier,
    });
  }
});

//enter bot token
client.login(
  ""
);

const requestListener = async function (req, res) {
  console.log(req.socket.remoteAddress);
  if (req.url === "/patreonwhitelist") {
    let entries = [
      "Group=Admin:chat,kick,cameraman,canseeadminchat,reserve",
      "Group=Whitelist:reserve",
      "Group=ContentCreator:cameraman,reserve",
    ];

    const results = await DiscordLinkup.findAll({
      where: { patreonTier: { [Op.ne]: "0" } },
      order: [["adminTier", "DESC"]],
    });
    const currentTime = new Date();
    const squaddieTime =
      (currentTime.getDay() == 5 && currentTime.getHours >= 15) ||
      currentTime.getDay() == 6 ||
      currentTime.getDay() == 0 ||
      (currentTime.getDay() == 6 && currentTime.getHours() < 3);
    for (const val of results) {
      if (val.steamID != null) {
        if (val.patreonTier == "1016926889014734908" && !squaddieTime) {
          continue;
        }
        let group = "";
        const cameramanPatreonTierID = "1179229617031233678"; // Replace with the actual Patreon tier ID
        
        if (val.adminTier !== "0") {
          group = "Admin";
        } else if (val.patreonTier === cameramanPatreonTierID) {
          group = "ContentCreator";
        } else if (val.patreonTier === "1016926889014734908") {
          group = "Squaddie";
        } else {
          group = "Whitelist";
        }
        
        entries.push(
          "Admin=" +
            val.steamID +
            ":" +
            group +
            " //Name: " +
            val.discordTag
        );
      }
      if (val.buddyIDs != null) {
        mybuddies = JSON.parse(val.buddyIDs).slice(
          0,
          buddyCount[val.patreonTier]
        );
        for (const buddy of mybuddies) {
          entries.push(
            "Admin=" + buddy + ":Whitelist //Buddy of name: " + val.discordTag
          );
        }
      }
    }
    res.writeHead(200, { "Content-Type": "text/plain;charset=UTF-8" });
    res.end(entries.join("\r\n"));
    console.log("Served whitelist at: " + new Date());
    return;
  }
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("ACCES DENIED");
  console.log("Wrong endpoint requested (or favicon request)");
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
