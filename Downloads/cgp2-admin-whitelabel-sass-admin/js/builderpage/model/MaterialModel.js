/**
 * @author xiu
 * @date 2023/9/25
 */
Ext.define("CGP.builderpage.model.MaterialModel", {
    extend: 'Ext.data.Model',
    idProperty: 'materialPath',
    fields: [
        'materialName',
        'materialCode',
        'materialPath',
        {
            name: 'materialViews',
            type: 'array'
        },
        {
            name: 'idProperty',
            type: 'string',
            convert: function (value, record) {
                var materialCode = record.get('materialCode'),
                    materialPath = record.get('materialPath');

                return `${materialCode}_${materialPath}`;
            },
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orderItemsV2/{id}/materials/materialViews',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
