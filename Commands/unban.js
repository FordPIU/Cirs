const { CheckTargetPermissions, DoesBanExist, RemoveBan } = require('../Utilities/Cmd_Moderation');

module.exports = async function(interaction, commandData)
{
    let Target      = commandData.Target;
    let Reason      = commandData.Reason;

    // Check Permissions
    let HasPermissions = await CheckTargetPermissions(Target, interaction);
    if (HasPermissions == false) { return; }

    // Validate Target
    if (DoesBanExist(Target) == false) {
        interaction.reply({ content: `<@${Target}> is not banned.`, fetchReply: true })
            .catch(console.error);

        return;
    }

    // Unban
    RemoveBan(Target, interaction.user.tag);

    // Reply.
    interaction.reply({ content: `<@${Target}> has been unbanned for ${Reason}`, fetchReply: true })
        .catch(console.error);
}