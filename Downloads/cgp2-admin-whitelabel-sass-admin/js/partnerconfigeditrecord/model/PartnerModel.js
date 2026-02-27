/**
 * @author xiu
 * @date 2024/5/31
 */
Ext.define('CGP.partnerconfigeditrecord.model.PartnerModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'name',
            type: 'string',
            convert: function (value, record) {
                return value + '<' + record.getId() + '>'
            }
        },
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'partnerType',
            type: 'string'
        },
        {
            name: 'email',
            type: 'string'
        }
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