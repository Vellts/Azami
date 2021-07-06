const url = require("url");
const path = require("path");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const config = require("../config");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const Discord = require("discord.js");
//const cmds = require('../cmds.json')
const fetch = require("node-fetch")
const app = express();
const MemoryStore = require("memorystore")(session);

// SCHEMAS //

const Maintenance = require('../database/schemas/maintenance');
let GuildSettings = require("../database/schemas/Guild");
let WelcomeSchema = require("../database/schemas/welcome");
let LeaveSchema = require("../database/schemas/leave");

// SCHEMAS //

module.exports = async (client) => {
  const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);
  const templateDir = path.resolve(`${dataDir}${path.sep}templates`);

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));
  
  var callbackUrl;
  var domain;
  
  try {
    const domainUrl = new URL(config.domain);
    domain = {
      host: domainUrl.hostname,
      protocol: domainUrl.protocol
    };
  } catch (e) {
    console.log(e);
    throw new TypeError("Invalid domain specific in the config file.");
  }
  
  if (config.usingCustomDomain) {
    callbackUrl =  `${domain.protocol}//${domain.host}/callback`
  } else {
    callbackUrl = `${domain.protocol}//${domain.host}${config.port == 3000 ? "" : `:${config.port}`}/callback`;
  } 
  
  /*console.log("===");
  console.log(`Info: Make sure you have added the following url to the discord's OAuth callback url section in the developer portal:\n${callbackUrl}`);
  console.log("===");*/

  // We set the passport to use a new discord strategy, we pass in client id, secret, callback url and the scopes.
  /** Scopes:
   *  - Identify: Avatar's url, username and discriminator.
   *  - Guilds: A list of partial guilds.
  */
  passport.use(new Strategy({
    clientID: config.id,
    clientSecret: config.clientSecret,
    callbackURL: callbackUrl,
    scope: ["identify", "guilds"]
  },
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, profile));
  }));

  app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.locals.domain = config.domain.split("//")[1];

  app.engine("html", ejs.renderFile);
  app.set("view engine", "html");

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  
  app.use("/", express.static(path.resolve(`${dataDir}${path.sep}assets`)));
  
  const renderTemplate = (res, req, template, data = {}) => {
    const baseData = {
      bot: client,
      path: req.path,
      user: req.isAuthenticated() ? req.user : null
    };
    res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
  };

  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
  }

  // Login del usuario
  app.get("/login", (req, res, next) => {
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL; // eslint-disable-line no-self-assign
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = "/";
    }
    next();
  },
  passport.authenticate("discord"));

  // obtencion de los datos
  app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), (req, res) => {
    if (req.session.backURL) {
      const url = req.session.backURL;
      req.session.backURL = null;
      res.redirect(url);
    } else {
      res.redirect("/");
    }
  });

  app.get("/logout", function (req, res) {
    req.session.destroy(() => {
      req.logout();
        res.redirect("/"); // redirigimos el usuario al index
    });
  });

  app.get("/", (req, res) => {
    renderTemplate(res, req, "index.ejs");
  });

  app.get("/test", (req, res) => {

    const guilds = client.guilds.cache.size

    renderTemplate(res, req, "test.ejs", { guilds })
  })

  app.get("/manage", checkAuth, (req, res) => {
    renderTemplate(res, req, "dashboard.ejs", { perms: Discord.Permissions });
  }); 

  app.get("/dashboard/:guildID/", checkAuth, (req, res) => {
    let botc = req.params.guildID
    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");

    let channel = guild.channels.cache.filter(x => x.type === 'text').size
    let voicechannel = guild.channels.cache.filter(x => x.type === 'voice').size
    let members = guild.members.cache.filter(m => m.user).size
    let membersbot = guild.members.cache.filter(m => m.user.bot).size
    let emoji = guild.emojis.cache.size
    let roles = guild.roles.cache.size

    renderTemplate(res, req, "modules.ejs", { channel, guild, voicechannel, members, membersbot, emoji, roles, perms: Discord.Permissions });
  });

  app.get("/comandos", (req, res) => {
  try {
    renderTemplate(res, req, "comandos.ejs", {commands: cmds.commands })
  } catch(e){
    renderTemplate(res, req, "modules.ejs")
  }
  });

  /*app.get("*", (req, res) => {
    renderTemplate(res, req, "partials/error.ejs", {commands: cmds.commands })
  })*/

  app.get("/dashboard/:guildID/welcome", checkAuth, async (req, res) => {

      const guild = client.guilds.cache.get(req.params.guildID);
      if (!guild) return res.redirect("/dashboard");
      const member = await guild.members.fetch(req.user.id);
      if (!member) return res.redirect("/dashboard");
      if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");

const maintenance = await Maintenance.findOne({
  maintenance: "maintenance"
})

if(maintenance && maintenance.toggle == "true") {

     return renderTemplate(res, req, "maintenance.ejs")

}

      var storedSettings = await GuildSettings.findOne({ guildId: guild.id });
      if (!storedSettings) {

        const newSettings = new GuildSettings({
          guildId: guild.id
        });
        await newSettings.save().catch(() => { });
        storedSettings = await GuildSettings.findOne({ guildId: guild.id });



      }
      var welcomeSettings = await WelcomeSchema.findOne({ guildId: guild.id });
      if (!welcomeSettings) {

        const newSettings = new WelcomeSchema({
          guildId: guild.id
        });
        await newSettings.save().catch(() => { });
        welcomeSettings = await WelcomeSchema.findOne({ guildId: guild.id });



      }

      var leaveSettings = await LeaveSchema.findOne({ guildId: guild.id });
      if (!leaveSettings) {

        const newSettings = new LeaveSchema({
          guildId: guild.id
        });
        await newSettings.save().catch(() => { });
        leaveSettings = await LeaveSchema.findOne({ guildId: guild.id });



      }


      renderTemplate(res, req, "./new/mainwelcome.ejs", {
        guild: guild,
        alert: null,
        leave: leaveSettings,
        settings: storedSettings,
        welcome: welcomeSettings,
        leave: leaveSettings,
      });
    });

    app.post("/dashboard/:guildID/welcome", checkAuth, async (req, res) => {

      const guild = client.guilds.cache.get(req.params.guildID);
      if (!guild) return res.redirect("/dashboard");
      const member = await guild.members.fetch(req.user.id);
      if (!member) return res.redirect("/dashboard");
      if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");

const maintenance = await Maintenance.findOne({
  maintenance: "maintenance"
})

if(maintenance && maintenance.toggle == "true") {

     return renderTemplate(res, req, "maintenance.ejs")

}

      var storedSettings = await GuildSettings.findOne({ guildId: guild.id });
      if (!storedSettings) {
        const newSettings = new WelcomeSchema({
          guildId: guild.id
        });
        await newSettings.save().catch(() => { });
        storedSettings = await GuildSettings.findOne({ guildId: guild.id });



      }
      var welcomeSettings = await WelcomeSchema.findOne({ guildId: guild.id });
      if (!welcomeSettings) {

        const newSettings = new GuildSettings({
          guildId: guild.id
        });
        await newSettings.save().catch(() => { });
        welcomeSettings = await WelcomeSchema.findOne({ guildId: guild.id });



      }
      var leaveSettings = await LeaveSchema.findOne({ guildId: guild.id });
      if (!leaveSettings) {

        const newSettings = new LeaveSchema({
          guildId: guild.id
        });
        await newSettings.save().catch(() => { });
        leaveSettings = await LeaveSchema.findOne({ guildId: guild.id });



      }

      let data = req.body

      if (Object.prototype.hasOwnProperty.call(data, "welcomeSave")) {



        let welcomeValid = await guild.channels.cache.find((ch) => `# ${ch.name}` === data.welcomeChannel);


        if (welcomeValid) {

          welcomeSettings.welcomeChannel = guild.channels.cache.find((ch) => `# ${ch.name}` === data.welcomeChannel).id;


        } else {

          welcomeSettings.welcomeChannel = null;

        }


      }



      // leave save
      if (Object.prototype.hasOwnProperty.call(data, "leaveSave")) {



        let leaveValid = await guild.channels.cache.find((ch) => `# ${ch.name}` === data.leaveChannel);


        if (leaveValid) {

          leaveSettings.leaveChannel = guild.channels.cache.find((ch) => `# ${ch.name}` === data.leaveChannel).id;


        } else {

          leaveSettings.leaveChannel = null;

        }


      }


      // leave start



      if (Object.prototype.hasOwnProperty.call(data, "leaveEnable") || Object.prototype.hasOwnProperty.call(data, "leaveUpdate")) {

        let checkDM = req.body["leaveDM"]
        if (checkDM) {
          leaveSettings.leaveDM = true
        } else {
          leaveSettings.leaveDM = false
        }

        let checkIfEmbed = req.body["leaveEmbed"]

        if (checkIfEmbed) {
          let database = await guild.channels.cache.get(leaveSettings.leaveChannel);


          if (!database) {

            leaveSettings.leaveToggle = false;
            await leaveSettings.save().catch(() => { });

            renderTemplate(res, req, "./new/mainwelcome.ejs", {
              guild: guild,
              alert: `Please make sure to save the welcome Channel first ❌`,
              settings: storedSettings,
              welcome: welcomeSettings,
              leave: leaveSettings,
            });
            return;
          };
          leaveSettings.leaveEmbed = true

        } else {


          let database = await guild.channels.cache.get(leaveSettings.leaveChannel);


          if (!database) {

            leaveSettings.leaveToggle = false;
            await leaveSettings.save().catch(() => { });

            renderTemplate(res, req, "./new/mainwelcome.ejs", {
              guild: guild,
              alert: `Please make sure to save the welcome Channel first ❌`,
              settings: storedSettings,
              welcome: welcomeSettings,
              leave: leaveSettings,
            });
            return;
          };

          if (data.leaveMessage) {

            if (data.leaveMessage.length > 2000) {

              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Please make sure text length is below 2000❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });
              return;
            }

            leaveSettings.leaveMessage = data.leaveMessage;

          } else {

            renderTemplate(res, req, "./new/mainwelcome.ejs", {
              guild: guild,
              alert: `Please Provide me with a text ❌`,
              settings: storedSettings,
              welcome: welcomeSettings,
              leave: leaveSettings,
            });

            return;
          }

          leaveSettings.leaveToggle = true;
          leaveSettings.leaveChannel = database.id
          leaveSettings.leaveEmbed = false


        }

      };

      if (Object.prototype.hasOwnProperty.call(data, "leaveEnableEmbed") || Object.prototype.hasOwnProperty.call(data, "leaveUpdateEmbed")) {

        let data = req.body;

        let checkDM = req.body["leaveDM"]
        if (checkDM) {
          leaveSettings.leaveDM = true
        } else {
          leaveSettings.leaveDM = false
        };

        let checkIfEmbed = req.body["leaveEmbed"]



        if (checkIfEmbed) {


          // author


          // author name
          if (data.leave_author_name) {

            if (data.leave_author_name.length > 256) {

              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Please make sure the author length is below 200❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });
              return;
            }


            leaveSettings.embed.author.name = data.leave_author_name;
          } else {
            leaveSettings.embed.author.name = ``;

          }

          // author URL

          if (data.leave_author_url) {



            if (rgx.test(data.leave_author_url) || data.leave_author_url.toLowerCase() == "{useravatar}") {

              leaveSettings.embed.author.url = data.leave_author_url;

            } else {
              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Please make sure this is a valid URL❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });
              return;
            }

          } else {
            leaveSettings.embed.author.url = ``;
          }


          // icon
          if (data.leave_author_icon) {

            if (rgx.test(data.leave_author_icon) || data.leave_author_icon.toLowerCase() == "{useravatar}") {

              leaveSettings.embed.author.icon = data.leave_author_icon;

            } else {
              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Please make sure this is a valid URL❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });
              return;
            }


          } else {

            leaveSettings.embed.author.icon = ``;
          }

          // embed Title

          if (data.leave_embedTitle) {

            if (data.leave_embedTitle.length > 200) {

              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Please make sure your title is under 200 characters long❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });
              return;

            }

            leaveSettings.embed.title = data.leave_embedTitle

          } else {
            renderTemplate(res, req, "./new/mainwelcome.ejs", {
              guild: guild,
              alert: `Please make sure to include a title❌`,
              settings: storedSettings,
              welcome: welcomeSettings,
              leave: leaveSettings,
            });
            return;
          }

          // welcome embed title url

          if (data.leave_embedTitleURL) {

            if (rgx.test(data.leave_embedTitleURL)) {

              leaveSettings.embed.titleURL = data.leave_embedTitleURL;

            } else {
              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Invalid Link Provided ❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });
              return;
            }
          } else {
            leaveSettings.embed.titleURL = ``;
          }

          // description

          if (data.leave_embedDescription) {

            if (data.leave_embedDescription.length > 2000) {

              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Make sure the description is below 2000 characters long ❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });

              return;
            }

            leaveSettings.embed.description = data.leave_embedDescription;
          } else {

            renderTemplate(res, req, "./new/mainwelcome.ejs", {
              guild: guild,
              alert: `Please provide a description ❌`,
              settings: storedSettings,
              welcome: welcomeSettings,
              leave: leaveSettings,
            });

            return;
          }

          // thumbnail URL

          if (data.leave_embedThumbnail) {

            if (rgx.test(data.leave_embedThumbnail)) {

              leaveSettings.embed.thumbnail = data.leave_embedThumbnail;

            } else {
              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Please provide a valid thumbnail❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });

              return;
            }


          } else {

            leaveSettings.embed.thumbnail = ``;

          }

          // footer

          if (data.leave_embedFooter) {

            if (data.leave_embedFooter.length > 1048) {

              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Make sure the footer is under 1000 characters long ❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });

              return;
            }
            leaveSettings.embed.footer = data.leave_embedFooter;

          } else {

            leaveSettings.embed.footer = "";
          }

          // footer icon


          if (data.leave_embedFooterIcon) {

            if (rgx.test(data.leave_embedFooterIcon)) {

              leaveSettings.embed.footerIcon = data.leave_embedFooterIcon;

            } else {
              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Invalid Footer Icon ❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });



              return;

            }

          } else {
            leaveSettings.embed.footerIcon = "";
          }

          // Timestamp

          let timestamp = req.body["leave_timestamp"]
          if (timestamp) {
            leaveSettings.embed.timestamp = true
          } else {
            leaveSettings.embed.timestamp = false
          }

          //color 
          if (data.leave_embedColor) {
            leaveSettings.embed.color = data.leave_embedColor
          } else {
            leaveSettings.embed.color = `#000000`
          }

          leaveSettings.leaveEmbed = true;

          //end
        } else {
          leaveSettings.leaveEmbed = false;
        }

        leaveSettings.leaveToggle = true;
      }




      // leave end

      if (Object.prototype.hasOwnProperty.call(data, "welcomeEnable") || Object.prototype.hasOwnProperty.call(data, "welcomeUpdate")) {

        let checkDM = req.body["dmUser"]
        if (checkDM) {
          welcomeSettings.welcomeDM = true
        } else {
          welcomeSettings.welcomeDM = false
        }

        let checkIfEmbed = req.body["isEmbed"]

        if (checkIfEmbed) {
          let database = await guild.channels.cache.get(welcomeSettings.welcomeChannel);


          if (!database) {

            welcomeSettings.welcomeToggle = false;
            await welcomeSettings.save().catch(() => { });

            renderTemplate(res, req, "./new/mainwelcome.ejs", {
              guild: guild,
              alert: `Please make sure to save the welcome Channel first ❌`,
              settings: storedSettings,
              welcome: welcomeSettings,
              leave: leaveSettings,
            });
            return;
          };
          welcomeSettings.welcomeEmbed = true;

        } else {


          let database = await guild.channels.cache.get(welcomeSettings.welcomeChannel);


          if (!database) {
            welcomeSettings.welcomeToggle = false;
            await welcomeSettings.save().catch(() => { });
            renderTemplate(res, req, "./new/mainwelcome.ejs", {
              guild: guild,
              alert: `Please make sure to save the welcome Channel first ❌`,
              settings: storedSettings,
              welcome: welcomeSettings,
              leave: leaveSettings,
            });
            return;
          };

          if (data.welcomeMessage) {

            if (data.welcomeMessage.length > 2000) {

              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Please make sure text length is below 2000❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });
              return;
            }

            welcomeSettings.welcomeMessage = data.welcomeMessage;

          } else {

            renderTemplate(res, req, "./new/mainwelcome.ejs", {
              guild: guild,
              alert: `Please Provide me with a text ❌`,
              settings: storedSettings,
              welcome: welcomeSettings,
              leave: leaveSettings,
            });

            return;
          }

          welcomeSettings.welcomeToggle = true;
          welcomeSettings.welcomeChannel = database.id
          welcomeSettings.welcomeEmbed = false


        }

      };

      if (Object.prototype.hasOwnProperty.call(data, "welcomeEnableEmbed") || Object.prototype.hasOwnProperty.call(data, "welcomeUpdateEmbed")) {

        let checkDM = req.body["dmUser"]
        if (checkDM) {
          welcomeSettings.welcomeDM = true
        } else {
          welcomeSettings.welcomeDM = false
        }

        let checkIfEmbed = req.body["isEmbed"]

        let data = req.body

        if (checkIfEmbed) {


          // author


          // author name
          if (data.author_name) {

            if (data.author_name.length > 256) {

              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Please make sure the author length is below 200❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });
              return;
            }


            welcomeSettings.embed.author.name = data.author_name;
          } else {
            welcomeSettings.embed.author.name = ``;

          }

          // author URL

          if (data.author_url) {



            if (rgx.test(data.author_url) || data.author_url.toLowerCase() == "{useravatar}") {

              welcomeSettings.embed.author.url = data.author_url;

            } else {
              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Please make sure this is a valid URL❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });
              return;
            }

          } else {
            welcomeSettings.embed.author.url = ``;
          }


          // icon
          if (data.author_icon) {

            if (rgx.test(data.author_icon) || data.author_icon.toLowerCase() == "{useravatar}") {

              welcomeSettings.embed.author.icon = data.author_icon;

            } else {
              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Please make sure this is a valid URL❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });
              return;
            }


          } else {

            welcomeSettings.embed.author.icon = ``;
          }

          // embed Title
          if (data.embedTitle) {

            if (data.embedTitle.length > 200) {

              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Please make sure your title is under 200 characters long❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });
              return;

            }

            welcomeSettings.embed.title = data.embedTitle

          } else {
            renderTemplate(res, req, "./new/mainwelcome.ejs", {
              guild: guild,
              alert: `Please make sure to include a title❌`,
              settings: storedSettings,
              welcome: welcomeSettings,
              leave: leaveSettings,
            });
            return;
          }

          // welcome embed title url

          if (data.embedTitleURL) {

            if (rgx.test(data.embedTitleURL)) {

              welcomeSettings.embed.titleURL = data.embedTitleURL;

            } else {
              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Invalid Link Provided ❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });
              return;
            }
          } else {
            welcomeSettings.embed.titleURL = ``;
          }

          // description

          if (data.embedDescription) {

            if (data.embedDescription.length > 2000) {

              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Make sure the description is below 2000 characters long ❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });

              return;
            }

            welcomeSettings.embed.description = data.embedDescription;
          } else {

            renderTemplate(res, req, "./new/mainwelcome.ejs", {
              guild: guild,
              alert: `Please provide a description ❌`,
              settings: storedSettings,
              welcome: welcomeSettings,
              leave: leaveSettings,
            });

            return;
          }

          // thumbnail URL

          if (data.embedThumbnail) {

            if (rgx.test(data.embedThumbnail) || data.embedThumbnail.toLowerCase() == "{useravatar}") {

              welcomeSettings.embed.thumbnail = data.embedThumbnail;

            } else {
              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Please provide a valid thumbnail❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });

              return;
            }


          } else {

            welcomeSettings.embed.thumbnail = ``;

          }

          if (data.embedImage) {

            if (rgx.test(data.embedImage) || data.embedImage.toLowerCase() == "{useravatar}") {

              welcomeSettings.embed.image = data.embedImage;

            } else {
              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Please provide a valid image❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });

              return;
            }


          } else {

            welcomeSettings.embed.image = ``;

          }

          // footer

          if (data.embedFooter) {

            if (data.embedFooter.length > 1048) {

              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Make sure the footer is under 1000 characters long ❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });

              return;
            }
            welcomeSettings.embed.footer = data.embedFooter;

          } else {

            welcomeSettings.embed.footer = "";
          }

          // footer icon


          if (data.embedFooterIcon) {

            if (rgx.test(data.embedFooterIcon)) {

              welcomeSettings.embed.footerIcon = data.embedFooterIcon;

            } else {
              renderTemplate(res, req, "./new/mainwelcome.ejs", {
                guild: guild,
                alert: `Invalid Footer Icon ❌`,
                settings: storedSettings,
                welcome: welcomeSettings,
                leave: leaveSettings,
              });



              return;

            }

          } else {
            welcomeSettings.embed.footerIcon = "";
          }

          // Timestamp

          let timestamp = req.body["timestamp"]
          if (timestamp) {
            welcomeSettings.embed.timestamp = true
          } else {
            welcomeSettings.embed.timestamp = false
          }

          //color 
          if (data.embedColor) {
            welcomeSettings.embed.color = data.embedColor
          } else {
            welcomeSettings.embed.color = `#000000`
          }

          welcomeSettings.welcomeEmbed = true;

          //end
        } else {
          welcomeSettings.welcomeEmbed = false;
        }

        welcomeSettings.welcomeToggle = true;
      }
      if (Object.prototype.hasOwnProperty.call(data, "welcomeDisable")) {
        welcomeSettings.welcomeToggle = false;

      }

      if (Object.prototype.hasOwnProperty.call(data, "leaveDisable")) {
        leaveSettings.leaveToggle = false;

      }

      await welcomeSettings.save().catch(() => { })
      await leaveSettings.save().catch(() => { })
      renderTemplate(res, req, "./new/mainwelcome.ejs", {
        guild: guild,
        alert: `Your Changes have been saved! ✅`,
        settings: storedSettings,
        welcome: welcomeSettings,
        leave: leaveSettings,
      });
    });

  app.listen(config.port, null, null, () => {});
};
