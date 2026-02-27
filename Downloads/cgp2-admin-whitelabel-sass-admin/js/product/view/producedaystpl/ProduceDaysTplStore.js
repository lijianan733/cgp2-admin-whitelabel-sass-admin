Ext.define("CGP.product.view.producedaystpl.ProduceDaysTplStore", {
    extend: 'Ext.data.Store',
    pageSize: 25,
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        }, {
            name: 'name',
            type: 'string'
        }, {
            name: 'description',
            type: 'string'
        }, {
            name: 'sortOrder',
            type: 'int'
        }, {
            name: 'rules',
            type: 'array'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/produceDaysTemplates',
        reader: {
            root: 'data.content',
            type: 'json'
        }
    },
    autoLoad: true
});