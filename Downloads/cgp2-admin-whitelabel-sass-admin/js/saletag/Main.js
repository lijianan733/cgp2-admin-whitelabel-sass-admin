/**
 * Created by nan on 2020/10/29
 */
Ext.Loader.syncRequire([
    'CGP.saletag.store.SaleTagStore',
    'CGP.saletag.model.SaleTagModel'
])
Ext.onReady(function () {
    var store = Ext.create('CGP.saletag.store.SaleTagStore');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('销售标签'),
        block: 'saletag',
        editPage: 'edit.html',
        gridCfg: {
            store: store,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                },
                {
                    text: i18n.getKey('color'),
                    dataIndex: 'color',
                    flex: 1,
                    renderer: function (value, metaData, record) {
                        var color = value;
                        color = color.toLocaleUpperCase();
                        color = ('<div style="display: flex;align-items: center;justify-content: flex-start" ><a class=colorpick style="background-color:' + color + '"></a>' + color+'</div>');
                        return color;
                    }
                }
            ]
        },

        // 查询输入框
        filterCfg: {
            items: [{
                name: '_id',
                xtype: 'numberfield',
                hideTrigger: true,
                isLike: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: '_id'
            }, {
                name: 'name',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }]
        }
    });
});
