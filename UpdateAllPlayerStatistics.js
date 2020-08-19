handlers.updateAllPlayerStatistics = function (args, context) {
    var points = 0;
    if (args && args.hasOwnProperty("Points"))
        points = args.Points;

    var highScoreStatResult = updatePlayerStatistics("High Score", points);
    var latestScoreStatResult = updatePlayerStatistics("Latest Score", points);
    var totalScoreStatResult = updatePlayerStatistics("Total Score", points);
    var totalAttemptsStatResult = updatePlayerStatistics("Total Attempts", 1);

    var returnMessage = [];
    returnMessage.push(highScoreStatResult);
    returnMessage.push(latestScoreStatResult);
    returnMessage.push(totalScoreStatResult);
    returnMessage.push(totalAttemptsStatResult);
    
    return returnMessage;
};

function updatePlayerStatistics(statisticName, value)
{
    var request = {
        PlayFabId: currentPlayerId,
        Statistics: [{
            StatisticName: statisticName,
            Value: value
        }]
    };
    var playerStatResult = server.UpdatePlayerStatistics(request);
    return playerStatResult;
}