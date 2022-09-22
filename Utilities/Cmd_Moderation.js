const { CommandInteraction, GuildMember } = require('discord.js'); // Just to import the type.
const { clientId, allServersString, guildList, userDataDict } = require('../Config.json');
const { GetCurrentEpochMinutes, GetEpochMinutesFromParams, GetDateString } = require('./Time');
const fs = require('fs');

/**
 * Gets the string of servers affected based on IsSync boolean command variable.
 * @param {boolean} IsSync Should be passed from Interaction getBoolean(), if the command should be sync cross-server.
 * @param {CommandInteraction} interaction Should be passed from the Interaction itself, used for the guild name.
 * @returns {string} Returns server name if IsSync is false, returns a custom string to signal that its all servers if IsSync is true.
 */
exports.GetServerStringFromIsSync = async function(IsSync, interaction)
{
    if(IsSync)
        { return allServersString }
    else
        { return interaction.guild.name };
}

/**
 * Gets the list of servers affected based on IsSync boolean command variable.
 * @param {boolean} IsSync Should be passed from Interaction getBoolean(), if the command should be sync cross-server.
 * @param {CommandInteraction} interaction Should be passed from the Interaction itself, used for the guild id.
 * @returns {Array} Returns a list of Guild Id(s).
 */
exports.GetServerListFromIsSync = async function(IsSync, interaction)
{
    if(IsSync)
        { return guildList }
    else
        { return [interaction.guildId]; };
}

/**
 * Checks that the target is not the executor, not this bot, not a bot, and isn't of a higher role.
 * @param {GuildMember} Target Should be passed from the Interaction getUser(), used for checks.
 * @param {CommandInteraction} interaction Should be passed from the Interaction itself, used for checks & responses.
 * @returns {boolean} True is the command passes checks, false if not. Should be terminated if false.
 */
exports.CheckTargetPermissions = async function(Target, interaction)
{
    // Self check
    if (Target.id == interaction.user.id) {
        interaction.reply({content: `You cannot Moderate yourself.`});
        return false; }

    // Cirs Check
    if (Target.id == clientId) {
        interaction.reply({content: `Your trying to Moderate me?`});
        return false; }

    // Bot Check
    if (Target.bot == true) {
        interaction.reply({content: `You cannot Moderate a bot.`});
        return false; }

    // Role check
    if (interaction.guild.members.fetch(Target.id).roles != null) {
    if (interaction.member.roles.highest.position <= interaction.guild.members.fetch(Target.id).roles.highest.position) {
        interaction.reply({content: `You cannot Moderate someone above or equal to you.`});
        return false; }}

    return true;
}

/**
 * Gets the Epoch Minutes of when a action should end, with the Time Number and Type passed.
 * @param {number} Time The time as a number. Example: 5
 * @param {string} Type The time as a type. Example: Minutes
 * @returns {number} Time at Call + Time passed
 */
exports.GetDurationTime = async function(Time, Type)
{
    let CurrentMinuteEpoch   = await GetCurrentEpochMinutes();
    let ParameterMinuteEpoch = await GetEpochMinutesFromParams(Type, Time);
    return ((CurrentMinuteEpoch + ParameterMinuteEpoch) * 60000);
}

/**
 * Send the target a Direct Message Notification of the action.
 * @param {String} ActionString String defining the action, like "banned" or "muted".
 * @param {Array} commandData Command Data passed to the command.
 */
exports.SendNotificationDM = async function(ActionString, commandData)
{
    let NotificationString = `-----------------------------------------------------------------
You have been ${ActionString} from ${commandData.SyncString}.
\n**By:** <@${commandData.Exector.id}>
**For:** ${commandData.Reason}`

    if (commandData.Duration != null) { NotificationString = NotificationString + `
**Duration:** ${commandData.TimeInt} ${commandData.TimeType}` }

    NotificationString = NotificationString + `
-----------------------------------------------------------------`

    commandData.Target.send(NotificationString)
        .catch(console.error);
}

/**
 * Reply to the command executor with the notification.
 * @param {String} ActionString String defining the action, like "banned" or "muted".
 * @param {CommandInteraction} interaction Interaction Object for replies.
 * @param {Array} commandData Command Data passed to the command.
 */
 exports.SendNotificationReply = async function(ActionString, interaction, commandData)
 {
    let NotificationString = `<@${commandData.Target.id}> has been ${ActionString} from ${commandData.SyncString}, for ${commandData.Reason}`

    if (commandData.Duration != null) {
        NotificationString = NotificationString + `, with a Duration of ${commandData.TimeInt} ${commandData.TimeType}.`
    }
    else {
        NotificationString = NotificationString + `.`
    }
 
    interaction.reply({ content: NotificationString, fetchReply: true  })
        .catch(console.error);
 }

/**
 * Register a New Disciplinary Action to the users Profile Record.
 * @param {string} Type Discipline Type
 * @param {GuildMember} Target The Disciplined User
 * @param {Array} Data An array of data, container executor information.
 */
exports.NewDisciplinaryAction = async function(Type, Target, Data)
{
    // Init Vars
    let Epoch = await GetDateString();
    let Profile = null;

    // Set Time String
    Data.Time = Epoch;

    // Check if Profile already exists, if not create it.
    if (fs.existsSync(userDataDict + 'Users/' + Target.id + ".json")) {
        let UserProfile = fs.readFileSync(userDataDict + 'Users/' + Target.id + ".json");

        Profile = JSON.parse(UserProfile);
    } else {
        Profile = {
            "Username": Target.username,
            "Tag": Target.tag,
            "Id": Target.id,
            "Disciplinary_Actions": {}
        }
    }

    // Check if Discipline Type is registered
    if (Profile.Disciplinary_Actions[Type] == null) { Profile.Disciplinary_Actions[Type] = {} }

    // Get Length of Discipline Type
    let DATLength = Object.keys(Profile.Disciplinary_Actions[Type]).length;
    
    // Post Data
    Profile.Disciplinary_Actions[Type][DATLength + 1] = Data

    // Write file
    fs.writeFile(userDataDict + 'Users/' + Target.id + ".json", JSON.stringify(Profile), err => {
        if (err) {
            console.error(err);
        }
    });
}

/**
 * Ban a user. Applies the ban in discord, and on json records.
 * @param {Array} commandData Command Data passed to the command.
 * @param {CommandInteraction} interaction The interaction object.
 */
exports.AddBan = async function(commandData, interaction)
{
    // Init Vars
    let Target      = commandData.Target;
    let Reason      = commandData.Reason;
    let Type        = commandData.TimeType;
    let Time        = commandData.TimeInt;
    let IsSync      = commandData.IsSync;
    let File = null;
    let guildList = await exports.GetServerListFromIsSync(IsSync, interaction);

    // Check if Active Bans already exists, if not create it.
    if (fs.existsSync(userDataDict + 'ActiveBans.json')) {
        File = JSON.parse(fs.readFileSync(userDataDict + 'ActiveBans.json'));
    } else { File = {}; }

    // Get Length of Active Bans
    let FLength = Object.keys(File).length;

    // Post Data
    File[FLength + 1] = {
        "Affected_Guilds":  guildList,
        "Deaffect_Epoch":   await exports.GetDurationTime(Time, Type),
        "Target_Id":        Target.id,
    }

    // Apply Bans
    guildList.forEach(guildId => {
        var client = require('../Login')();
        var iguild = client.guilds.cache.get(guildId);

        iguild.members.ban(Target.id, {deleteMessageDays: 0, deleteMessageSeconds: 0, reason: Reason})
            .catch(console.error);
    });

    // Write File
    fs.writeFile(userDataDict + 'ActiveBans.json', JSON.stringify(File), err => {
        if (err) {
            console.error(err);
        }
    });
}

/**
 * Checks ban records for if the duration is up.
 */
exports.CheckBanDurations = async function()
{
    // Init Vars
    let Time = await GetCurrentEpochMinutes();
    let client = require('../Login')();

    // File Exists check, if not return
    if (!fs.existsSync(userDataDict + 'ActiveBans.json')) { return; }

    // Get File and Length
    let File = JSON.parse(fs.readFileSync(userDataDict + 'ActiveBans.json'));
    let FLength = Object.keys(File).length;

    // Check Length
    if (FLength == 0) { return; }

    // Go threw every ban
    for (var [index, banData] of Object.entries(File)) {
        // Set Guilds Vars
        let Guilds = banData.Affected_Guilds;

        // Time Check
        if (banData.Deaffect_Epoch < Time) {
            // Go threw every guild and unban the user.
            Guilds.forEach(guildId => {
                var iguild = client.guilds.cache.get(guildId);

                iguild.bans.remove(banData.Target_Id, 'Ban Expired.');
                console.log(banData.Target_Id + "'s ban has expired.");
                
                File[index] = null;
            });
        }
    }

    // Rewrite
    let NewFile = {};
    let NewFileI = 0;

    for (var [index, banData] of Object.entries(File)) {
        if (banData != null ) { NewFileI++; NewFile[NewFileI] = banData }
    }

    // Write File
    fs.writeFile(userDataDict + 'ActiveBans.json', JSON.stringify(NewFile), err => {
        if (err) {
            console.error(err);
        }
    });
}

/**
 * Unban a user.
 * @param {Number} TargetId Target ID to unban
 * @param {String} Executor Executor Discord Tag
 */
exports.RemoveBan = async function (TargetId, Executor)
{
    // Init Vars
    let client = require('../Login')();

    // File Exists check, if not return
    if (!fs.existsSync(userDataDict + 'ActiveBans.json')) { return; }

    // Get File and Length
    let File = JSON.parse(fs.readFileSync(userDataDict + 'ActiveBans.json'));
    let FLength = Object.keys(File).length;

    // Check Length
    if (FLength == 0) { return; }

    // Go threw every ban
    for (var [index, banData] of Object.entries(File)) {
        // Target Check
        if (banData.Target_Id == TargetId) {
            // Set Guilds Vars
            let Guilds = banData.Affected_Guilds;

            // Go threw every guild
            Guilds.forEach(guildId => {
                var iguild = client.guilds.cache.get(guildId);

                iguild.bans.remove(banData.Target_Id, `Unbanned by ${Executor}.`);
                console.log(`${banData.Target_Id} has been unbanend by ${Executor}.`);
                
                File[index] = null;
            });
        }
    }

    // Rewrite
    let NewFile = {};
    let NewFileI = 0;

    for (var [index, banData] of Object.entries(File)) {
        if (banData != null ) { NewFileI++; NewFile[NewFileI] = banData }
    }

    // Write File
    fs.writeFile(userDataDict + 'ActiveBans.json', JSON.stringify(NewFile), err => {
        if (err) {
            console.error(err);
        }
    });
}

/**
 * Checks if a ban exists, returns true if it does.
 * @param {Number} TargetId User Id to check for.
 * @returns {Boolean} Exists.
 */
exports.DoesBanExist = async function (TargetId)
{
    // File Exists check, if not return
    if (!fs.existsSync(userDataDict + 'ActiveBans.json')) { return false; }

    // Get File and Length
    let File = JSON.parse(fs.readFileSync(userDataDict + 'ActiveBans.json'));
    let FLength = Object.keys(File).length;

    // Check Length
    if (FLength == 0) { return false; }

    // Go threw every ban
    for (var [index, banData] of Object.entries(File)) {
        if (banData.Target_Id == TargetId) {
            return true;
        }
    }

    // Return false
    return false;
}