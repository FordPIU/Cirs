const { CheckTargetPermissions, SendNotificationDM, SendNotificationReply, NewDisciplinaryAction, AddBan } = require('../Utilities/Cmd_Moderation');

module.exports = async function(interaction, commandData)
{
    let Target      = commandData.Target;
    let Reason      = commandData.Reason;
    let Type        = commandData.TimeType;
    let Time        = commandData.TimeInt;
    let SyncString  = commandData.SyncString;

    // Check Permissions
    let HasPermissions = await CheckTargetPermissions(Target, interaction);
    if (HasPermissions == false) { return; }

    // Send Target DM.
    SendNotificationDM("banned", commandData);

    // Add Ban
    AddBan(commandData, interaction);

    // Reply.
    SendNotificationReply("banned", interaction, commandData);

    // Log.
    NewDisciplinaryAction("Ban", Target, {
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