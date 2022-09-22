const { guildList } = require('../Config.json');
const { CheckTargetPermissions, SendNotificationDM, SendNotificationReply, NewDisciplinaryAction } = require('../Utilities/Cmd_Moderation');

module.exports = async function(interaction, commandData)
{
    let Target      = commandData.Target;
    let Reason      = commandData.Reason;
    let Sync        = commandData.IsSync;
    let SyncString  = commandData.SyncString;
    let Type        = commandData.TimeType;
    let Time        = commandData.TimeInt;
    let TimeMs      = commandData.Duration * 60000;

    // Check Permissions
    let HasPermissions = await CheckTargetPermissions(Target, interaction);
    if (HasPermissions == false) { return; }

    // Send Target DM.
    SendNotificationDM("muted", commandData);

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
    SendNotificationReply("muted", interaction, commandData);

    // Log.
    NewDisciplinaryAction("Mute", Target, {
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