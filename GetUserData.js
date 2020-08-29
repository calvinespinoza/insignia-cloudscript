handlers.getUserData = function (args, context) {
    var user = server.GetUserAccountInfo({ PlayFabId: currentPlayerId });

    var userDataRequest = {
        PlayFabId: currentPlayerId,
        Keys: ["Age", "Country", "School"]
    }

    var userData = server.GetUserData(userDataRequest);

    var returnObject = {
        PlayFabId: currentPlayerId,
        Username: user.UserInfo.Username,
        DisplayName: user.UserInfo.TitleInfo.DisplayName,
        Age: userData.Data.Age.Value,
        Country: userData.Data.Country.Value,
        School: userData.Data.School.Value
    }
    return returnObject
}