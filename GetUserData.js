handlers.getUserData = function (args, context) {
    var user = server.GetUserAccountInfo({ PlayFabId: currentPlayerId });

    var userDataRequest = {
        PlayFabId: currentPlayerId,
        Keys: ["Age", "Country", "School"]
    }

    var userData = server.GetUserData(userDataRequest);

    var stats = server.GetPlayerStatistics({ PlayFabId: currentPlayerId });

    var pointsHistory = getUserPointsHistory(user.UserInfo.TitleInfo.TitlePlayerAccount);

    var returnObject = {
        PlayFabId: currentPlayerId,
        Username: user.UserInfo.Username,
        DisplayName: user.UserInfo.TitleInfo.DisplayName,
        Age: userData.Data.Age.Value,
        Country: userData.Data.Country.Value,
        School: userData.Data.School.Value,
        Statistics: stats.Statistics, 
        PointsHistory: pointsHistory
    }
    return returnObject;
}

function getUserPointsHistory(entityProfile) {
    try {
        var entityObjects = entity.GetObjects({
            Entity: entityProfile
        });
    } catch (ex) {
        log.error(ex);
    }
    log.debug(entityObjects);
    if (entityObjects.Objects.PointsHistory)
        return entityObjects.Objects.PointsHistory.DataObject.History;

    return null
}