function getCurrentEntity(context) {
    if (context.currentEntity)
        return context.currentEntity.Entity;

    return server.GetUserAccountInfo({
        PlayFabId: currentPlayerId
    }).UserInfo.TitleInfo.TitlePlayerAccount;
}

handlers.updateAllPlayerStatistics = function (args, context) {
    var points = 0;
    var entityProfile = getCurrentEntity(context);

    log.info({ updatedEntity: entityProfile });

    if (args && args.hasOwnProperty("Points"))
        points = args.Points;

    var returnMessage = updatePlayerStatistics(points);
    addPointsHistory(points, entityProfile);

    return returnMessage;
};

function updatePlayerStatistics(value) {
    var request = {
        PlayFabId: currentPlayerId,
        Statistics: [
            {
                StatisticName: "High Score",
                Value: value
            },
            {
                StatisticName: "Latest Score",
                Value: value
            },
            {
                StatisticName: "Total Score",
                Value: value
            },
            {
                StatisticName: "Total Attempts",
                Value: 1
            },
        ]
    };
    var playerStatResult = server.UpdatePlayerStatistics(request);
    return playerStatResult;
}

function addPointsHistory(value, entityProfile) {
    try {
        var entityObjects = entity.GetObjects({
            Entity: entityProfile
        });
    } catch (ex) {
        log.error(ex);
    }

    log.debug(entityObjects);

    var setObjectsRequest = {
        Entity: entityProfile,
        Objects: [
            {
                ObjectName: "Points_History",
                DataObject: {
                    Points: value
                }
            }
        ]
    };

    try {
        entity.SetObjects(setObjectsRequest);
    } catch (ex) {
        log.error(ex);
    }
}
