const fs = require('fs');

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

    if (fs.existsSync('./Users/' + Target.id)) {
        UserProfile = fs.readFileSync('./Users/' + Target.id);
        Profile = JSON.parse(UserProfile);
        console.log("Exists");
    } else {
        Profile = {
            "Username": Target.username,
            "Tag": Target.tag,
            "Id": Target.id,
            "Disciplinary_Actions_Count": 0,
            "Disciplinary_Actions": {}
        }
        console.log("Created");
    }
    Profile.Disciplinary_Actions_Count += 1;
    Profile.Disciplinary_Actions[Disciplinary_Actions_Count] = InsertData;

    fs.writeFile('./Users/' + Target.id, Profile);
}