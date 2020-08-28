handlers.SetObjectsTest = function (args, context) {
    var entityProfile = context.currentEntity;
    var apirequest = {
        Objects: [
            {
                "ObjectName": "SaveSate",
                "DataObject": {
                    "PlayerDetails": {
                        "MapPosition": [
                            22,
                            37.78
                        ],
                        "IsPaidUpgrade": true
                    }
                }
            },
            {
                "SimpleStatements": {
                    "Read": [
                        {
                            "Friend": true
                        }
                    ]
                }
            }
        ],
        Entity: entityProfile.Entity
    }
    try {
        var apiresult = entity.SetObjects(apirequest);
    }
    catch (ex) {
        log.error(ex);
    }


    return apiresult;
}