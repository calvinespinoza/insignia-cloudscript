handlers.updateAllPlayerStatistics = function (args, context) {
    var points = 0;
    var entity = context.currentEntity;

    if (args && args.hasOwnProperty("Points"))
        points = args.Points;

    if (args && args.hasOwnProperty("Entity"))
        entity = args.Points;

    var returnMessage = updatePlayerStatistics(points);

    if (entity)
        addPointsHistory(points, entity);
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

function addPointsHistory(value, entity) {
    var dataObject =
    {
        Points: value
    }
    var setObjectsRequest = {
        Entity: entity,
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