const { guildList } = require('../Config.json');
const { CheckTargetPermissions, SendNotificationDM, SendNotificationReply, NewDisciplinaryAction } = require('../Utilities/Cmd_Moderation');

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
    SendNotificationDM("kicked", commandData);

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
    SendNotificationReply("kicked", interaction, commandData);

    // Log.
    NewDisciplinaryAction("Kick", Target, {
        "Reason": Reason,
        "From": SyncString,
        "Executor": {
            "Username": interaction.user.username,
            "Tag": interaction.user.tag,
            "Id": interaction.user.id,
        }
    })
}