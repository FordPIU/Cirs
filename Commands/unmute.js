const { guildList } = require('../Config.json');
const { CheckTargetPermissions, SendNotificationDM, SendNotificationReply } = require('../Utilities/Cmd_Moderation');

module.exports = async function(interaction, commandData)
{
    let Target      = commandData.Target;
    let Reason      = commandData.Reason;
    let Sync        = commandData.IsSync;
    let SyncString  = commandData.SyncString;

    // Check Permissions
    let HasPermissions = await CheckTargetPermissions(Target, interaction);
    if (HasPermissions == false) { return; }

    // Send Target DM.
    SendNotificationDM("unmuted", commandData);

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
    SendNotificationReply("unmuted", interaction, commandData);
}