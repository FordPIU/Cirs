const SyncKickString = "**All Servers**";
exports.GetSyncString = async function(IsSync, interaction)
{
    if(IsSync) { return SyncKickString } else { return interaction.guild.name };
}