function getCurrentEntity() {
    var response = client.GetAccountInfo({
        PlayFabId: currentPlayerId
    });

    return response.data.AccountInfo.TitleInfo.TitlePlayerAccount;
}

handlers.updateAllPlayerStatistics = function (args, context) {
    var points = 0;
    var entity = context.currentEntity;

    if (args && args.hasOwnProperty("Points"))
        points = args.Points;

    if (args && args.hasOwnProperty("Entity"))
        entity = args.Points;

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
    var dataObject =
    {
        Points: value
    }
    var setObjectsRequest = {
        Entity: getCurrentEntity(),
        Objects: [
            {
                ObjectName: "Points History",
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