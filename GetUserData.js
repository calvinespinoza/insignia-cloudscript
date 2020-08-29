handlers.getUserData = function(args, context)
{
    var userData = server.GetUserAccountInfo({PlayFab: currentPlayerId});
    return {userData: userData }
}