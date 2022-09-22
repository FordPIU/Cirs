const { CheckTargetPermissions, SendNotificationDM, SendNotificationReply, NewDisciplinaryAction } = require('../Utilities/Cmd_Moderation');

module.exports = async function(interaction, commandData)
{
    let Target      = commandData.Target;
    let Reason      = commandData.Reason;

    // Check Permissions
    let HasPermissions = await CheckTargetPermissions(Target, interaction);
    if (HasPermissions == false) { return; }

    // Send Target DM.
    SendNotificationDM("warned", commandData);

    // Reply.
    SendNotificationReply("warned", interaction, commandData);

    // Log.
    NewDisciplinaryAction("Warn", Target, {
        "Reason": Reason,
        "Executor": {
            "Username": interaction.user.username,
            "Tag": interaction.user.tag,
            "Id": interaction.user.id,
        }
    })
}