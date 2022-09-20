const fs = require('fs');
const Types = {
    "minutes" :  1,
    "hours"   :  60,
    "days"    :  1440,
    "weeks"   :  10080,
    "months"  :  43800,
    "years"   :  525600
}

async function GetTime()
{
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
}

async function GetTimeInM()
{
    return Date.now() / 60000;
}

async function GetDurationTime(Time, Type)
{
    let baseMS = await GetTimeInM();
    let typeMS = Types[Type]

    if (typeMS != null) { return baseMS + (Time * typeMS) };
}
exports.GetDurationTimeInMinutes = async function(Time, Type)
{
    let typeMS = Types[Type]

    if (typeMS != null) { return Time * typeMS };
}

exports.logDiscipline = async function(Type, Target, Data)
{
    let OSTime = await GetTime();
    let UserProfile = null;
    let Profile = null;
    let InsertData = {
        "Time": OSTime,
        "Type": Type,
        "Data": Data
    };

    if (fs.existsSync('Profiles/Users/' + Target.id + ".json")) {
        UserProfile = fs.readFileSync('Profiles/Users/' + Target.id + ".json");
        Profile = JSON.parse(UserProfile);
    } else {
        Profile = {
            "Username": Target.username,
            "Tag": Target.tag,
            "Id": Target.id,
            "Disciplinary_Actions_Count": 0,
            "Disciplinary_Actions": {}
        }
    }
    Profile.Disciplinary_Actions_Count += 1;
    Profile.Disciplinary_Actions[Profile.Disciplinary_Actions_Count] = InsertData;

    fs.writeFile('Profiles/Users/' + Target.id + ".json", JSON.stringify(Profile), err => {
        if (err) {
            console.error(err);
        }
    });
}

exports.addBan = async function(Target, Time, Type, GuildId)
{
    let File = null;
    if (fs.existsSync('Profiles/ActiveBans.json')) {
        let FileRaw = fs.readFileSync('Profiles/ActiveBans.json');
        File = JSON.parse(FileRaw);
    } else {
        File = {
            "Length": 0,
            "Body": {}
        }
    }

    File.Length += 1
    File.Body[File.Length] = {
        "Affected_Guilds":  GuildId,
        "Deaffect_Epoch":   await GetDurationTime(Time, Type),
        "Target_Id":        Target.id,
    }

    fs.writeFile('Profiles/ActiveBans.json', JSON.stringify(File), err => {
        if (err) {
            console.error(err);
        }
    });
}

exports.checkDurations = async function()
{
    if (fs.existsSync('Profiles/ActiveBans.json')) {

        let FileRaw = fs.readFileSync('Profiles/ActiveBans.json');

        if (FileRaw != null | FileRaw != "") {

            let File = JSON.parse(FileRaw);

            if (File != null) {

                let currentTime = await GetTimeInM();
                let client = require('../Login')();

                for (let i = 1; i < (File.Length + 1); i++) {
                    let DurationData = File.Body[i];

                    if (DurationData != null) {

                        console.log(currentTime, DurationData.Deaffect_Epoch)

                        if (DurationData.Deaffect_Epoch < currentTime) {

                            DurationData.Affected_Guilds.forEach(guildId => {

                                let iguild = client.guilds.cache.get(guildId);

                                iguild.bans.remove(DurationData.Target_Id)
                                    .catch(console.error);

                            });

                            File.Body[i] = null;

                        }

                    }

                };

                fs.writeFile('Profiles/ActiveBans.json', JSON.stringify(File), err => {
                    if (err) {
                        console.error(err);
                    }
                });

            }

        }

    }

}