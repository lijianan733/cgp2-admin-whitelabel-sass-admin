Ext.define('CGP.costenterconfig.model.processCostConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'number',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.mccs.domain.cost.ProcessCostConfig'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'value',
            type: 'object'
        },
        {
            name: 'effectiveDuration',
            type: 'object'
        },
        {
            name: 'costAllocateStrategy',
            type: 'string',
            defaultValue: 'TIME_BASE'
        },
        {
            name: 'processCharacters',
            type: 'array',
        },
        {
            name: 'workingUnitCharacter',
            type: 'string',
            convert: function (value, record) {
                var processCharacters = record.get('processCharacters');
                if (processCharacters) {
                    if (processCharacters.length > 0) {
                        return processCharacters[0].workingUnitCharacter;
                    }
                }
            }
        },
        {
            name: 'processcharacter',
            type: 'string',
            convert: function (value, record) {
                var scope,
                    description,
                    result = [];
                var newValue = record.get('processCharacters');
                if (newValue) {
                    newValue.forEach(item => {
                        if (item.workingUnitCharacter) {
                            var workingUnitCharacter = item.workingUnitCharacter;
                            if (workingUnitCharacter.clazz === 'com.qpp.qris.eds.domain.workingunit.DeviceDescription') {
                                var character = workingUnitCharacter.characters[0];
                                var comparedValue = character.scope.comparedValue;
                                var matcherType = character.scope.matcherType;
                                if (matcherType === 'IN') {
                                    scope = '机台代码在以下范围:[' + comparedValue + ']';
                                } else {
                                    scope = '机台代码不在以下范围:[' + comparedValue + ']';
                                }
                                result.push(
                                    {
                                        title: i18n.getKey('workingUnit') + i18n.getKey('character'),
                                        value: scope
                                    }
                                )
                            }
                        }
                        if (item.manufactureCenterCharacter) {
                            var manufactureCenterCharacter = item.manufactureCenterCharacter;
                            description = manufactureCenterCharacter.description;
                            result.push(
                                {
                                    title: i18n.getKey('manufactureCenter') + i18n.getKey('character'),
                                    value: description
                                }
                            )
                        }
                    })
                }
                return JSCreateHTMLTable(result);
            }
        }
    ],
    proxy: {
        type: 'uxrest',
        url: mccsPath + 'api/processCostConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }

});
