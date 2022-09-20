const { logDiscipline, removeBan, existsBan } = require('../Profiles/_Handler');

module.exports = async function(interaction)
{
    let Target = interaction.options.getString('target');
    let Reason = interaction.options.getString('reason');

    // Console Write
    console.log(`\nCommand Call: Unban
    Target: ${Target}
    For: ${Reason}`);

    // Validate Target
    let NullCheck = existsBan(Target);
    if (NullCheck == false) {
        interaction.reply({ content: `${Target} is not banned.`, fetchReply: true })
            .catch(console.error);
    }

    // Unban
    removeBan(Target, interaction.user.tag);

    // Reply.
    interaction.reply({ content: `${Target} has been unbanned for ${Reason}`, fetchReply: true })
        .catch(console.error);
}