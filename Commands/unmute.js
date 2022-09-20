const { guildList } = require('../Config.json');
const { GetSyncString, ModerationCommandsCheck } = require('./_Utils');

module.exports = async function(interaction)
{
    let Target = interaction.options.getUser('target');
    let Reason = interaction.options.getString('reason');
    let Sync   = interaction.options.getBoolean('sync');
    let SyncString = await GetSyncString(Sync, interaction);

    // Console Write
    console.log(`\nCommand Call: Unmute
    Target: ${Target.username}
    From: ${SyncString}
    For: ${Reason}`);

    // Check Permissions
    let HasPermissions = await ModerationCommandsCheck(Target, interaction);
    if (HasPermissions == false) { return; }

    // Send Target DM.
    Target.send(`You have been unmuted from ${SyncString}.
        \n**By:** ${interaction.user.username}.
**For:** ${Reason}.`)
            .catch(console.error);

    // Unmute
    if (Sync) {
        guildList.forEach(guildId => {
            var client = require('../Login')();
            var iguild = client.guilds.cache.get(guildId);

            let iuser = iguild.members.fetch(Target.id)
                .catch(console.error);

            if (iuser != null) {
                iguild.members.cache.get(Target.id).timeout(null, Reason)
                    .catch(console.error);
            }
        });
    } else {
        interaction.guild.members.cache.get(Target.id).timeout(null, Reason)
            .catch(console.error);
    }

    // Reply.
    interaction.reply({ content: `${Target.username} has been unmuted from ${SyncString} for ${Reason}.`, fetchReply: true })
        .catch(console.error);
}