Ext.define('CGP.common.typesettingschedule.model.TypesettingScheduleModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.composing.domain.Task',
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'status',
            type: 'string',
        },
        {
            name: 'startTime',
            type: 'string'
        },
        {
            name: 'endTime',
            type: 'string'
        },
        {
            name: 'stages',
            type: 'array'
        },
        {
            name: 'datas',
            type: 'object'
        },
        {
            name: 'manufactureCenter',
            type: 'string'
        },
        {
            name: 'seqNo',
            type: 'number',
            convert: function (value, record) {
                var datas = record.get('datas');
                
                return datas?.seqNo;
            }
        }
    ],
    /*proxy: {
        type: 'uxrest',
        url: composingPath + 'api/composing/progresses',
        reader: {
            type: 'json',
            root: 'data'
        }
    }*/
})