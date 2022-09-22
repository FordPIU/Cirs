exports.logcommand = function(Type, Target, Executor, From, For, Duration)
{
    let LogString = `\nCommand Call: ${Type}`;

    if (Target != null)     { LogString = LogString + `\nTarget:    ${Target.tag}`      }
    if (Executor != null)   { LogString = LogString + `\nExecutor:  ${Executor.tag}`    }
    if (From != null)       { LogString = LogString + `\nFrom:      ${From}`            }
    if (For != null)        { LogString = LogString + `\nFor:       ${For}`             }
    if (Duration != null)   { LogString = LogString + `\nDuration:  ${Duration} minutes`}

    console.log(LogString);
}