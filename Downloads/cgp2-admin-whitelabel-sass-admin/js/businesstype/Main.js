/**
 * Created by nan on 2021/9/11
 */
Ext.Loader.syncRequire([
    'CGP.pcresourcelibrary.config.Config'
])
Ext.onReady(function () {
    var store = Ext.create('CGP.businesstype.store.BusinessTypeStore');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('businessType'),
        block: 'businesstype',
        editPage: 'edit.html',
        gridCfg: {
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                tdCls: 'vertical-middle'
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                }, {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 200,
                }, {
                    text: i18n.getKey('resources') + i18n.getKey('type'),
                    dataIndex: 'type',
                    width: 200,
                    renderer: function (value) {
                        return value.split('.').pop();
                    }
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    flex: 1,
                }
            ]
        },
        // 查询输入框
        filterCfg: {
            minHeight: 120,
            items: [{
                name: '_id',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }, {
                xtype: 'combo',
                name: 'type',
                itemId: 'type',
                fieldLabel: i18n.getKey('resources') + i18n.getKey('type'),
                editable: false,
                valueField: 'value',
                displayField: 'display',
                store: {
                    type: 'store',
                    fields: ['value', 'display'],
                    data: CGP.pcresourcelibrary.config.Config.IPCResourceType
                }
            }]
        }
    });
});
