const { guildList } = require('../Config.json');
const { logDiscipline } = require('../Profiles/_Handler');
const { GetSyncString, ModerationCommandsCheck, GetDurationTime } = require('./_Utils');

module.exports = async function(interaction)
{
    let Target = interaction.options.getUser('target');
    let Reason = interaction.options.getString('reason');
    let Type   = interaction.options.getString('type');
    let Time   = interaction.options.getInteger('time');
    let Sync   = interaction.options.getBoolean('sync');
    let SyncString = await GetSyncString(Sync, interaction);
    let TimeMs = await GetDurationTime(Time, Type);

    // Console Write
    console.log(`\nCommand Call: Mute
    Target: ${Target.username}
    From: ${SyncString}
    For: ${Reason}
    Duration: ${Time} ${Type}
    Miliseconds: ${TimeMs}`);

    // Check Permissions
    let HasPermissions = await ModerationCommandsCheck(Target, interaction);
    if (HasPermissions == false) { return; }

    // Send Target DM.
    Target.send(`You have been muted from ${SyncString}.
        \n**By:** ${interaction.user.username}.
**For:** ${Reason}.
**Duration:** ${Time} ${Type}`)
            .catch(console.error);

    // Mute
    if (Sync) {
        guildList.forEach(guildId => {
            var client = require('../Login')();
            var iguild = client.guilds.cache.get(guildId);

            let iuser = iguild.members.fetch(Target.id)
                .catch(console.error);

            if (iuser != null) {
                iguild.members.cache.get(Target.id).timeout(TimeMs, Reason)
                    .catch(console.error);
            }
        });
    } else {
        interaction.guild.members.cache.get(Target.id).timeout(TimeMs, Reason)
            .catch(console.error);
    }

    // Reply.
    interaction.reply({ content: `${Target.username} has been muted from ${SyncString} for ${Reason}, with a Duration of ${Time} ${Type}`, fetchReply: true })
        .catch(console.error);

    // Log.
    logDiscipline("Mute", Target, {
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