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

    var newPointsObject = {
        Points: value,
        Timestamp: getCurrentDate()
    }

    var dataObject = [newPointsObject];

    if (entityObjects.Objects.PointsHistory) {
        var pointsHistory = entityObjects.Objects.PointsHistory.DataObject.History;
        log.debug({ PointsHistory: pointsHistory });

        if (pointsHistory.length >= 10)
            pointsHistory.shift();

        pointsHistory.push(newPointsObject);
        dataObject = pointsHistory;
    }

    log.debug({ newDataObject: dataObject });

    var setObjectsRequest = {
        Entity: entityProfile,
        Objects: [
            {
                ObjectName: "PointsHistory",
                DataObject: {
                    History: dataObject
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

function getCurrentDate()
{
    var date = new Date();
    var DD = date.getDate();
    var MM = date.getMonth() + 1;
    var YY = date.getFullYear().substring(2,4);
    var hh = date.getHours();
    var mm = date.getMinutes();

    return `${DD}/${MM}/${YY} ${hh}:${mm}`
}