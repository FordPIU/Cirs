const {clientId} = require('../Config.json')
const SyncKickString = "**All Servers**";
exports.GetSyncString = async function(IsSync, interaction)
{
    if(IsSync) { return SyncKickString } else { return interaction.guild.name };
}

exports.ModerationCommandsCheck = async function(Target, interaction)
{
    // Self check
    if (Target.id == interaction.user.id) {
        interaction.reply({content: `You cannot Moderate yourself.`});
        return false; }

    // Cirs Check
    if (Target.id == clientId) {
        interaction.reply({content: `Your trying to Moderate me?`});
        return false; }

    // Bot Check
    if (Target.bot == true) {
        interaction.reply({content: `You cannot Moderate a bot.`});
        return false; }

    // Role check
    if (interaction.member.roles.highest.position <= interaction.guild.members.fetch(Target.id).roles.highest.position) {
        interaction.reply({content: `You cannot Moderate someone above or equal to you.`});
        return false; }

    return true;
}