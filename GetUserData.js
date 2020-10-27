handlers.getUserData = function (args, context) {
    var user = server.GetUserAccountInfo({ PlayFabId: currentPlayerId });
    var titlePlayerAccount = user.UserInfo.TitleInfo.TitlePlayerAccount;

    var userDataRequest = {
        PlayFabId: currentPlayerId,
        Keys: ["Age", "Country", "School"]
    }

    var userData = server.GetUserData(userDataRequest);
    var stats = server.GetPlayerStatistics({ PlayFabId: currentPlayerId });
    
    var entityObjects = getPlayerEntityObjects(titlePlayerAccount);
    var pointsHistory = getUserPointsHistory(entityObjects);
    var levelProgress = getUserLevelProgress(entityObjects);
    
    var returnObject = {
        PlayFabId: currentPlayerId,
        Username: user.UserInfo.Username,
        DisplayName: user.UserInfo.TitleInfo.DisplayName,
        Age: userData.Data.Age.Value,
        Country: userData.Data.Country.Value,
        School: userData.Data.School.Value,
        Statistics: stats.Statistics, 
        PointsHistory: pointsHistory,
        LevelProgress: levelProgress
    }
    return returnObject;
}

function getPlayerEntityObjects(entityProfile) {
    try {
        var entityObjects = entity.GetObjects({
            Entity: entityProfile
        });
    } catch (ex) {
        log.error(ex);
    }
    log.debug(entityObjects);
    return entityObjects;
}

function getUserPointsHistory(entityObjects) {
    if (entityObjects.Objects.PointsHistory)
        return entityObjects.Objects.PointsHistory.DataObject.History;
    return null
}

function getUserLevelProgress(entityObjects) {
    if (entityObjects.Objects.LevelProgress)
        return entityObjects.Objects.PointsHistory.DataObject;
    return null
}