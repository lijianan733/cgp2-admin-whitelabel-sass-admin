/**
 * @author xiu
 * @date 2023/9/25
 */
Ext.define("CGP.builderrandomcardpage.model.MaterialModel", {
    extend: 'Ext.data.Model',
    idProperty: 'idProperty',
    fields: [
        'materialName',
        'materialCode',
        'materialPath',
        'groupCode',
        'designMethod',
        {
            name: 'materialViews',
            type: 'array'
        },
        {
            name: 'newMaterialName',
            type: 'string',
            convert: function (value, record) {
                var materialName = record.get('materialName') || '',
                    groupCode = record.get('groupCode') || '',
                    title = `${materialName} (${groupCode})`

                return title;
            },
        },
        {
            name: 'idProperty',
            type: 'string',
            convert: function (value, record) {
                var groupCode = record.get('groupCode') || '',
                    materialPath = record.get('materialPath'),
                    materialCode = record.get('materialCode');

                return `${materialCode}_${materialPath}_${groupCode}`;
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
