Ext.define('CGP.manufactureorderitem.model.ManufactureOrderItemStatusesModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'name',
            type: 'string',
            convert: function (value,record) {
                return i18n.getKey(value)
            }
        }
    ]
})