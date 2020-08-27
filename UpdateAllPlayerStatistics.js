handlers.updateAllPlayerStatistics = function (args, context) {
    var points = 0;
    if (args && args.hasOwnProperty("Points"))
        points = args.Points;

    var returnMessage = updatePlayerStatistics(points);
    addPointsHistory(points);
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

function addPointsHistory(value) {
    var entityProfile = context.currentEntity;

    var dataObject =
    {
        Points: value
    }
    var setObjectsRequest = {
        Entity: entityProfile.Entity,
        Objects: [
            {
                ObjectName: "Attempts",
                DataObject: dataObject
            }
        ]
    };

    try {
        entity.SetObjects(setObjectsRequest);
    } catch (ex) {
        log.error(ex);
    }
}