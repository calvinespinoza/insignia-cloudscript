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

    if (response)
        return response.UserInfo.TitleInfo.TitlePlayerAccount;
}

handlers.updateAllPlayerStatistics = function (args, context) {
    var points = 0;
    var entity = getCurrentEntity();

    log.info({updatedEntity: entity});

    if (args && args.hasOwnProperty("Points"))
        points = args.Points;

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
    var setObjectsRequest = {
        Entity: entity,
        Objects: [
            {
                ObjectName: "Points History",
                DataObject: {
                    Points: value
                }
            }
        ]
    };

    try {
        var response = entity.SetObjects(setObjectsRequest);
    } catch (ex) {
        log.error(ex);
    }
    log.info(response);