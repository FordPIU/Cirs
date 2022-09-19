const { guildList } = require('../Config.json');
const { logDiscipline } = require('../Logger/_Logger');
const { GetSyncString } = require('./_Utils')

module.exports = async function(interaction)
{
    let Target = interaction.options.getUser('target');
    let Reason = interaction.options.getString('reason');
    let Sync   = interaction.options.getBoolean('sync');
    let SyncString = GetSyncString(Sync, interaction);

    // Console Write
    console.log(`\nCommand Call: Kick\nTarget: ${Target.username}\nFrom: ${SyncString}\nFor: ${Reason}`);

    // Send Target DM.
    Target.send(`You have been kicked from ${SyncString}.\n\n**By:** ${interaction.user.username}\n**For:** ${Reason}.`)
        .catch(console.error);

    // Kick.
    if (Sync) {
        guildList.forEach(guildId => {
            var client = require('../Login')();
            var iguild = client.guilds.cache.get(guildId);

            iguild.members.kick(Target.id, Reason)
                .catch(console.error);
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