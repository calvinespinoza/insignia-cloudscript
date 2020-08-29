handlers.getUserData = function (args, context) {
    var userData = server.GetUserAccountInfo({ PlayFabId: currentPlayerId });
    return { userData: userData }
}