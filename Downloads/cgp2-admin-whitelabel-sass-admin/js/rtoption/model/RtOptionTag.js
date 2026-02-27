Ext.define('CGP.rtoption.model.RtOptionTag', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'number',
            useNull: true
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'leaf',
            type: 'boolean',
            defalutValue: false
        }, {
            name: 'nameId',
            type: 'string',
            convert: function (v, record) {
                return record.data.name + "(" + record.data.id + ")";
            }
        },
        {
            name: 'displayName',
            type: 'string',
            convert:function (v, record){
                return record.get('name')+'<'+record.get('id')+'>'
            }
        }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/rtOptionTags',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
