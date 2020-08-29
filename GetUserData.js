handlers.getUserData = function (args, context) {
    var user = server.GetUserAccountInfo({ PlayFabId: currentPlayerId });

    var userDataRequest = {
        PlayFabId: currentPlayerId,
        Keys: ["Age", "Country", "School"]
    }

    var userData = server.GetUserData(userDataRequest);

    var returnObject = {
        playFabId: currentPlayerId,
        username: user.UserInfo.Username,
        displayName: user.UserInfo.TitleInfo.DisplayName,
        age: userData.Data.Age.Value,
        country: userData.Data.Country.Value,
        school: userData.Data.School.Value
    }
    return returnObject
}