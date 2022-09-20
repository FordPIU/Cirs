const { guildList } = require('../Config.json');
const { logDiscipline, addBan } = require('../Profiles/_Handler');
const { GetSyncString, ModerationCommandsCheck } = require('./_Utils');

module.exports = async function(interaction)
{
    let Target = interaction.options.getUser('target');
    let Reason = interaction.options.getString('reason');
    let Type   = interaction.options.getString('type');
    let Time   = interaction.options.getInteger('time');
    let Sync   = interaction.options.getBoolean('sync');
    let SyncString = await GetSyncString(Sync, interaction);

    // Console Write
    console.log(`\nCommand Call: Ban
    Target: ${Target.username}
    From: ${SyncString}
    For: ${Reason}
    Duration: ${Time} ${Type}`);

    // Check Permissions
    let HasPermissions = await ModerationCommandsCheck(Target, interaction);
    if (HasPermissions == false) { return; }

    // Send Target DM.
    Target.send(`You have been banned from ${SyncString}.
        \n**By:** ${interaction.user.username}.
**For:** ${Reason}.
**Duration:** ${Time} ${Type}.`)
            .catch(console.error);

    // Ban + Add to Actives.
    if (Sync) {
        guildList.forEach(guildId => {
            var client = require('../Login')();
            var iguild = client.guilds.cache.get(guildId);

            iguild.members.ban(Target.id, {deleteMessageDays: 0, deleteMessageSeconds: 0, reason: Reason})
                .catch(console.error);
        });

        addBan(Target, Time, Type, guildList, "Ban");
    } else {
        interaction.guild.members.ban(Target.id, {deleteMessageDays: 0, deleteMessageSeconds: 0, reason: Reason})
            .catch(console.error);

            addBan(Target, Time, Type, [interaction.guildId], "Ban");
    }

    // Reply.
    interaction.reply({ content: `${Target.username} has been banned from ${SyncString} for ${Reason}, with a Duration of ${Time} ${Type}`, fetchReply: true })
        .catch(console.error);

    // Log.
    logDiscipline("Ban", Target, {
        "Reason": Reason,
        "From": SyncString,
        "Duration": Time + " " + Type,
        "Executor": {
            "Username": interaction.user.username,
            "Tag": interaction.user.tag,
            "Id": interaction.user.id,
        }
    })
}