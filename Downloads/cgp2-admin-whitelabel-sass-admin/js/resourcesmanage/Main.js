/**
 * Created by nan on 2018/8/9.
 */
Ext.syncRequire([
    'CGP.resourcesmanage.store.ResourcesStore',
    'CGP.resourcesmanage.model.ResourcesModel'
])
Ext.onReady(function () {
    var store = Ext.create('CGP.resourcesmanage.store.ResourcesStore', {})
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('resourcesManage'),
        block: 'resourcesManage',
        editPage: 'edit.html',
        gridCfg: {
            store: store,
            frame: false,
            columnDefaults: {
                width: 150
            },
            columns: [
                {
                    dataIndex: '_id',
                    text: i18n.getKey('id')
                },
                {
                    dataIndex: 'name',
                    text: i18n.getKey('name'),
                    width: 200,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return  value;
                    }
                },
                {
                    dataIndex: 'code',
                    text: i18n.getKey('code')
                },
                {
                    dataIndex: 'description',
                    text: i18n.getKey('description'),
                    width: 300,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return  value;
                    }
                },
                {
                    dataIndex: 'catalogId',
                    text: i18n.getKey('category')
                },
                {
                    dataIndex: 'resourceClass',
                    width: 300,
                    text: i18n.getKey('entityClass'),
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return  value;
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id',
                    isLike: false
                },
                {
                    name: 'catalogId',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('category'),
                    itemId: 'catalogId'
                },
                {
                    name: 'code',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('code'),
                    itemId: 'code'
                },
                {
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                }

            ]
        }
    });
})