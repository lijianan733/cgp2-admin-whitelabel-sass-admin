/**
 * @author xiu
 * @date 2024/5/31
 */
Ext.define('CGP.partnerconfigeditrecord.model.PartnerconfigeditrecordModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: '_id',
            type: 'string',
        },
        {
            name: 'type',
            type: 'string',
        },
        {
            name: 'startDate',
            type: 'string',
        },
        {
            name: 'intervalDays',
            type: 'number',
        },
        {
            name: 'createdDate',
            type: 'string',
        },
        {
            name: 'createdBy',
            type: 'string',
        },
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/colors',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})