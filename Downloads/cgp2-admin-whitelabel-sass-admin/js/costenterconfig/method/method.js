Ext.syncRequire(['CGP.processinstancejobcharacter.store.AbstractUProcessInstanceJobCharacterStore'])

Ext.define('CGP.costenterconfig.method.method', {
    TimestampToTime: function (timestamp, showType) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var result;
        if (showType === 'SHOW') {
            result = Ext.Date.format(date, 'Y年m月d日')
        } else if (showType === 'POST') {
            result = new Date(timestamp).toISOString();
        }

        return result;
    },

    FilterClazz: function (name) {
        var clazz;
        if (name === 'manufactureCenterCharactor') {
            clazz = 'com.qpp.mccs.domain.charactor.UProcessInstanceJobManufactureCenterCharacter'
        } else {
            clazz = 'com.qpp.mccs.domain.charactor.UProcessInstanceJobWorkingUnitCharacter'
        }
        var store = Ext.create('CGP.processinstancejobcharacter.store.AbstractUProcessInstanceJobCharacterStore', {
            params: {
                filter: '[{"name":"clazz","value":"' + clazz + '","type":"string"}]'
            }
        })
        return store;
    }
})