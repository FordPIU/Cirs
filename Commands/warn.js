const { logDiscipline } = require('../Profiles/_Handler');
const { ModerationCommandsCheck } = require('./_Utils')

module.exports = async function(interaction)
{
    let Target = interaction.options.getUser('target');
    let Reason = interaction.options.getString('reason');

    // Console Write
    console.log(`\nCommand Call: Warn
    Target: ${Target.username}
    For: ${Reason}`);

    // Check Permissions
    let HasPermissions = await ModerationCommandsCheck(Target, interaction);
    if (HasPermissions == false) { return; }

    // Send Target DM.
    Target.send(`You have been warned.\n\n**By:** ${interaction.user.username}\n**For:** ${Reason}.`)
        .catch(console.error);

    // Reply.
    interaction.reply({ content: `${Target.username} has been warned for ${Reason}`, fetchReply: true })
        .catch(console.error);

    // Log.
    logDiscipline("Warn", Target, {
        "Reason": Reason,
        "Executor": {
            "Username": interaction.user.username,
            "Tag": interaction.user.tag,
            "Id": interaction.user.id,
        }
    })
}