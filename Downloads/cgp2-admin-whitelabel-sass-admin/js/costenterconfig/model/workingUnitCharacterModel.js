Ext.define('CGP.costenterconfig.model.workingUnitCharacterModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.qris.eds.domain.workingunit.DeviceDescription'
        },
        {
            name: 'characters',
            type: 'array'
        },
        {
            name: 'scope',
            type: 'string',
            convert: function (value, record) {
                if (record.get('clazz') === 'com.qpp.qris.eds.domain.workingunit.DeviceDescription') {
                    var character = record.get('characters')[0];
                    var comparedValue = character.scope.comparedValue;
                    var matcherType = character.scope.matcherType;
                    if (matcherType === 'IN') {
                        return '机台代码在以下范围:[' + comparedValue + ']';
                    } else {
                        return '机台代码不在以下范围:[' + comparedValue + ']';
                    }
                } else {
                    var isMannual = record.get('isMannual');
                    if (isMannual) {
                        return '人工操作';
                    } else {
                        return '非人工操作';
                    }
                }
            }
        }
    ],
    proxy: {
        type: 'uxrest',
        url: mccsPath + 'api/workingUnitCharacters',
        reader: {
            type: 'json',
            root: 'data'
        }
    }

});
