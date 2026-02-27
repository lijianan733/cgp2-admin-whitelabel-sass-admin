/**
 *Created by nan on 2023/9/12
 * */

Ext.Loader.syncRequire([
    '',
])
Ext.onReady(function () {
    var store = Ext.create('CGP.postageconfigforweight.store.PostageConfigStore');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('重量计运费配置'),
        block: 'postageconfigforweight',
        editPage: 'edit.html',
        // 查询输入框
        filterCfg: {
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    hideTrigger: true,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    isLike: false,
                    itemId: '_id'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    isLike: false,
                    itemId: 'name'
                },
            ]
        },
        gridCfg: {
            store: store,
            frame: false,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: 'id',
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    itemId: 'name',
                    flex: 1
                },
            ]
        },
    });
});

