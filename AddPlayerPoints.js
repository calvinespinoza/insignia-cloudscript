function getCurrentEntity(context) {
    if (context.currentEntity)
        return context.currentEntity.Entity;

    return server.GetUserAccountInfo({
        PlayFabId: currentPlayerId
    }).UserInfo.TitleInfo.TitlePlayerAccount;
}

handlers.addPlayerPoints = function (args, context) {
    var points = 0;
    var entityProfile = getCurrentEntity(context);

    log.info({ updatedEntity: entityProfile });

    if (args && args.hasOwnProperty("Points"))
        points = args.Points;

    var returnMessage = updatePlayerStatistics(points);
    updatePointsHistory(points, entityProfile);
    var newLevelProgress = updateLevelProgress(points, entityProfile);

    return newLevelProgress;
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

function updatePointsHistory(value, entityProfile) {
    try {
        var entityObjects = entity.GetObjects({
            Entity: entityProfile
        });
    } catch (ex) {
        log.error(ex);
    }
    log.debug(entityObjects);

    var dataObject = getNewPointsHistoryDataObject(value, entityObjects);
    var pointsHistory = { History: dataObject };
    setPlayerObject(entityProfile, "PointsHistory", pointsHistory);
}

function getNewPointsHistoryDataObject(value, entityObjects) {
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
    return dataObject;
}

function getCurrentDate() {
    var now = new Date();
    var year = now.getFullYear().toString().substring(2, 4);
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    if (month.toString().length == 1) {
        month = '0' + month;
    }
    if (day.toString().length == 1) {
        day = '0' + day;
    }
    if (hour.toString().length == 1) {
        hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
        minute = '0' + minute;
    }
    if (second.toString().length == 1) {
        second = '0' + second;
    }
    var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    return dateTime;
}

function setPlayerObject(entityProfile, objectName, dataObject) {
    var setObjectsRequest = {
        Entity: entityProfile,
        Objects: [{
            ObjectName: objectName,
            DataObject: dataObject
        }]
    };

    try {
        entity.SetObjects(setObjectsRequest);
    } catch (ex) {
        log.error(ex);
    }
    
}

function updateLevelProgress(points, entityProfile) {
    try {
        var entityObjects = entity.GetObjects({
            Entity: entityProfile
        });
    } catch (ex) {
        log.error(ex);
    }

    var oldXP = 0; 
    var oldCurrentLevel = 1 

    if (entityObjects.Objects.LevelProgress) {
        var levelProgress = entityObjects.Objects.LevelProgress.DataObject;
        log.debug({ LevelProgress: levelProgress });

        if (levelProgress.XP)
            oldXP = levelProgress.XP;

        if (levelProgress.CurrentLevel)
            oldCurrentLevel = levelProgress.CurrentLevel;
    } 

    var newXP = oldXP + points;
    var newLevelData = calculateNewCurrentLevel(newXP, oldCurrentLevel); 
    
    var newLevelProgress = {
        XP: newXP,
        CurrentLevel: newLevelData.currentLevel,
        NextLevelProgress: newLevelData.nextLevelProgress
    }

    setPlayerObject(entityProfile, "LevelProgress", newLevelProgress);

    newLevelProgress.LevelledUp = oldCurrentLevel != newLevelData.currentLevel;
    return newLevelProgress;
}

function calculateNewCurrentLevel(newXP, currentLevel) {
    var nextLevelPoints = calculatePointToReachLevel(currentLevel + 1);

    while (newXP >= nextLevelPoints) {
        currentLevel++;
        nextLevelPoints = calculatePointsToReachLevel(currentLevel + 1);
    }
      
    var lastLevelPoints = calculatePointsToReachLevel(currentLevel - 1);
    var nextLevelProgress = (newXP - lastLevelPoints) / (nextLevelPoints - lastLevelPoints);
    return {
        currentLevel: currentLevel,
        nextLevelProgress: parseFloat((nextLevelProgress).toFixed(2))
    }
}

function calculatePointsToReachLevel(currentLevel) {
    var nextLvl = currentLevel + 1;
    return 2000 * Math.pow(nextLvl, 2) - 2000 * nextLvl;
}