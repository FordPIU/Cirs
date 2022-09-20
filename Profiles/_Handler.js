const { time } = require('console');
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
    // Init Vars
    let OSTime = await GetTime();
    let Profile = null;

    // Set Time String
    Data.Time = OSTime;

    // Check if Profile already exists, if not create it.
    if (fs.existsSync('Profiles/Users/' + Target.id + ".json")) {
        let UserProfile = fs.readFileSync('Profiles/Users/' + Target.id + ".json");

        Profile = JSON.parse(UserProfile);
    } else {
        Profile = {
            "Username": Target.username,
            "Tag": Target.tag,
            "Id": Target.id,
            "Disciplinary_Actions": {}
        }
    }

    // Check if Discipline Type is registered
    if (Profile.Disciplinary_Actions[Type] == null) { Profile.Disciplinary_Actions[Type] = {} }

    // Get Length of Discipline Type
    let DATLength = Object.keys(Profile.Disciplinary_Actions[Type]).length;
    
    // Post Data
    Profile.Disciplinary_Actions[Type][DATLength + 1] = Data

    // Write file
    fs.writeFile('Profiles/Users/' + Target.id + ".json", JSON.stringify(Profile), err => {
        if (err) {
            console.error(err);
        }
    });
}

exports.addBan = async function(Target, Time, Type, GuildId)
{
    // Init Vars
    let File = null;

    // Check if Active Bans already exists, if not create it.
    if (fs.existsSync('Profiles/ActiveBans.json')) {
        File = JSON.parse(fs.readFileSync('Profiles/ActiveBans.json'));
    } else { File = {}; }

    // Get Length of Active Bans
    let FLength = Object.keys(File).length;

    // Post Data
    File[FLength + 1] = {
        "Affected_Guilds":  GuildId,
        "Deaffect_Epoch":   await GetDurationTime(Time, Type),
        "Target_Id":        Target.id,
    }

    // Write File
    fs.writeFile('Profiles/ActiveBans.json', JSON.stringify(File), err => {
        if (err) {
            console.error(err);
        }
    });
}

exports.checkBans = async function()
{
    // Init Vars
    let Time = await GetTimeInM();
    let client = require('../Login')();

    // File Exists check, if not return
    if (!fs.existsSync('Profiles/ActiveBans.json')) { return; }

    // Get File and Length
    let File = JSON.parse(fs.readFileSync('Profiles/ActiveBans.json'));
    let FLength = Object.keys(File).length;

    // Check Length
    if (FLength == 0) { return; }

    // Go threw every ban
    for (var [index, banData] of Object.entries(File)) {
        // Time Check
        if (banData.Deaffect_Epoch < Time) {
            // Set Guilds Vars
            let Guilds = banData.Affected_Guilds;

            // Go threw every guild
            Guilds.forEach(guildId => {
                var iguild = client.guilds.cache.get(guildId);

                iguild.bans.remove(banData.Target_Id, 'Ban Expired.');
                console.log(banData.Target_Id + "'s ban has expired.");
                
                File[index] = null;
            });
        }
    }

    // Rewrite
    let NewFile = {};
    let NewFileI = 0;

    for (var [index, banData] of Object.entries(File)) {
        if (banData != null ) { NewFileI++; NewFile[NewFileI] = banData }
    }

    // Write File
    fs.writeFile('Profiles/ActiveBans.json', JSON.stringify(NewFile), err => {
        if (err) {
            console.error(err);
        }
    });
}

exports.removeBan = async function (TargetId, Executor)
{
    // Init Vars
    let client = require('../Login')();

    // File Exists check, if not return
    if (!fs.existsSync('Profiles/ActiveBans.json')) { return; }

    // Get File and Length
    let File = JSON.parse(fs.readFileSync('Profiles/ActiveBans.json'));
    let FLength = Object.keys(File).length;

    // Check Length
    if (FLength == 0) { return; }

    // Go threw every ban
    for (var [index, banData] of Object.entries(File)) {
        // Target Check
        if (banData.Target_Id == TargetId) {
            // Set Guilds Vars
            let Guilds = banData.Affected_Guilds;

            // Go threw every guild
            Guilds.forEach(guildId => {
                var iguild = client.guilds.cache.get(guildId);

                iguild.bans.remove(banData.Target_Id, `Unbanned by ${Executor}.`);
                console.log(`${banData.Target_Id} has been unbanend by ${Executor}.`);
                
                File[index] = null;
            });
        }
    }

    // Rewrite
    let NewFile = {};
    let NewFileI = 0;

    for (var [index, banData] of Object.entries(File)) {
        if (banData != null ) { NewFileI++; NewFile[NewFileI] = banData }
    }

    // Write File
    fs.writeFile('Profiles/ActiveBans.json', JSON.stringify(NewFile), err => {
        if (err) {
            console.error(err);
        }
    });
}

exports.existsBan = async function (TargetId)
{
    // File Exists check, if not return
    if (!fs.existsSync('Profiles/ActiveBans.json')) { return false; }

    // Get File and Length
    let File = JSON.parse(fs.readFileSync('Profiles/ActiveBans.json'));
    let FLength = Object.keys(File).length;

    // Check Length
    if (FLength == 0) { return false; }

    // Go threw every ban
    for (var [index, banData] of Object.entries(File)) {
        if (banData.Target_Id == TargetId) {
            return true;
        }
    }

    // Return false
    return false;
}