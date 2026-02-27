/**
 * Created by nan on 2017/12/18.
 */
Ext.define('CGP.partner.view.partnerordernotifyhistory.model.PartnerOrderNotifyHistoryModel', {
    extend: 'Ext.data.Model',
    fields: [
        {   name: '_id',
            type: 'string'
        },
        {   name: 'clazz',
            type: 'string'
        },
        {   name: 'config',
            type: 'object'
        },
        {   name: 'context',
            type: 'object'
        },
        {   name: 'idReference',
            type: 'string'
        },
        {   name: 'message',
            type: 'string'
        },
        {
            //创建日期
            name : 'notifyDate',
            type : 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {   name: 'partnerId',
            type: 'int'
        },
        {   name: 'partnerName',
            type: 'string'
        },
        {   name: 'success',
            type: 'boolean'
        }


    ]
});
