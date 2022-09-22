const TypesMultiplier = {
    "minutes" :  1,
    "hours"   :  60,
    "days"    :  1440,
    "weeks"   :  10080,
    "months"  :  43800,
    "years"   :  525600
}

/**
 * Get the current date and time.
 * @returns {string} Current Date & Time
 */
exports.GetDateString = async function()
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

/**
 * Get the current epoch in minutes.
 * @returns {number} Epoch in Minutes
 */
exports.GetCurrentEpochMinutes = async function()
{
    return Date.now() / 60000;
}

/**
 * 
 * @param {string} Type The type of time
 * @param {number} Time The base time
 * @returns {number} Time in Minutes
 */
exports.GetEpochMinutesFromParams = async function(Type, Time)
{
    let typeMS = TypesMultiplier[Type]

    if (typeMS != null) { return Time * typeMS };
    
    return null;
}