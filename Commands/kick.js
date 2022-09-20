const { guildList } = require('../Config.json');
const { logDiscipline } = require('../Profiles/_Handler');
const { GetSyncString, ModerationCommandsCheck } = require('./_Utils')

module.exports = async function(interaction)
{
    let Target = interaction.options.getUser('target');
    let Reason = interaction.options.getString('reason');
    let Sync   = interaction.options.getBoolean('sync');
    let SyncString = await GetSyncString(Sync, interaction);

    // Console Write
    console.log(`\nCommand Call: Kick
    Target: ${Target.username}
    From: ${SyncString}
    For: ${Reason}`);

    // Check Permissions
    let HasPermissions = await ModerationCommandsCheck(Target, interaction);
    if (HasPermissions == false) { return; }

    // Send Target DM.
    Target.send(`You have been kicked from ${SyncString}.\n\n**By:** ${interaction.user.username}\n**For:** ${Reason}.`)
        .catch(console.error);

    // Kick.
    if (Sync) {
        guildList.forEach(guildId => {
            var client = require('../Login')();
            var iguild = client.guilds.cache.get(guildId);

            let user = iguild.members.fetch(Target.id)
                .catch(console.error);

            if (user != null) {
                user.kick(Reason)
            }
        });
    } else {
        interaction.guild.members.kick(Target.id, Reason)
            .catch(console.error);
    }

    // Reply.
    interaction.reply({ content: `${Target.username} has been kicked from ${SyncString} for ${Reason}`, fetchReply: true })
        .catch(console.error);

    // Log.
    logDiscipline("Kick", Target, {
        "Reason": Reason,
        "From": SyncString,
        "Executor": {
            "Username": interaction.user.username,
            "Tag": interaction.user.tag,
            "Id": interaction.user.id,
        }
    })
}