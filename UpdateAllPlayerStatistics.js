function getCurrentEntity() {
    
    try {
        var response = server.GetUserAccountInfo({
            PlayFabId: currentPlayerId
        });
    } catch (ex) {
        log.error(ex);
        server.WriteTitleEvent({
            EventName : 'cs_error',
            Body : ex
        });
    }

    log.info(response);
    if (response.code == 200)
        return response.data.UserInfo.TitleInfo.TitlePlayerAccount;
}

handlers.updateAllPlayerStatistics = function (args, context) {
    var points = 0;
    var entity = getCurrentEntity();

    if (args && args.hasOwnProperty("Points"))
        points = args.Points;

    if (args && args.hasOwnProperty("Entity"))
        entity = args.Entity;

    var returnMessage = updatePlayerStatistics(points);
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
        Entity: entity.Id,
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