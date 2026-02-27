/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.Loader.syncRequire([
    'partner.productSupplier.view.OptionalConfigContainer',
    'partner.productSupplier.controller.Controller'
]);
Ext.define('partner.productSupplier.view.AddressMatcher', {
    extend: 'Ext.container.Container',
    alias: 'widget.address_matcher',
    diyGetValue: function () {
        var result = {};
        var me = this;
        var items = me.items.items;
        items.forEach(item => {
            var name = item.name;
            result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
        })
        return result;
    },
    diySetValue: function (data) {
        var me = this;
        var name = me.name;
        var items = me.items.items;
        var newData = data[name];
        newData && items.forEach(item => {
            var itemName = item.name;
            item.diySetValue ? item.diySetValue(newData[itemName]) : item.setValue(newData[itemName])
        });
    },
    initComponent: function () {
        var me = this;
        var store = Ext.create('Ext.data.Store', {
            fields: ['country', 'state', 'city'],
            data: []
        });
        var controller = Ext.create('partner.productSupplier.controller.Controller');
        me.items = [
            {
                xtype: 'textfield',
                name: '_id',
                hidden: true,
            },
            {
                xtype: 'textfield',
                name: 'clazz',
                hidden: true,
                value: 'com.qpp.cgp.domain.partner.cooperation.manufacture.SimpleAddressMatcher',
            },
            {
                xtype: 'optionalconfigcontainerv3',
                allowBlank: false,
                title: me.title,
                name: 'matchers',
                width: '100%',
                status: 'FINISHED',
                store: store,
                titleFn: Ext.emptyFn,
                containerConfig: {
                    defaults: {
                        width: 500,
                        margin: '0 0 10 10',
                        allowBlank: true,
                    },
                },
                diyGetValue: function () {
                    var me = this;
                    return me.store.getProxy().data;
                },
                diySetValue: function (data) {
                    var me = this;
                    me.store.getProxy().data = data;
                    me.store.load();
                },
                toolbarItems: [
                    {
                        xtype: 'button',
                        iconCls: 'icon_add',
                        text: i18n.getKey('添加'),
                        handler: function (btn) {
                            controller.addAddressBtn(false, store);
                        }
                    },
                ],
                containerItems: [
                    {
                        xtype: 'grid',
                        store: store,
                        width: 700,
                        maxHeight: 300,
                        columns: [
                            {
                                xtype: 'actioncolumn',
                                width: 50,
                                items: [
                                    {
                                        iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                                        tooltip: 'Edit',
                                        handler: function (grid, rowIndex, colIndex, a, b, record) {
                                            controller.addAddressBtn(true, store, rowIndex);
                                        }
                                    },
                                    {
                                        iconCls: 'icon_remove icon_margin',
                                        tooltip: 'Delete',
                                        handler: function (view, rowIndex, colIndex, a, b, record) {
                                            controller.removeAddressBtn(view, rowIndex, colIndex, a, b, record, store)
                                        }
                                    }
                                ]
                            },
                            {
                                flex: 1,
                                dataIndex: 'country',
                                text: i18n.getKey('国家/地区'),
                            },
                            {
                                flex: 1,
                                dataIndex: 'state',
                                text: i18n.getKey('省份'),
                            },
                            {
                                flex: 1,
                                dataIndex: 'city',
                                text: i18n.getKey('城市'),
                            },
                        ]
                    }
                ]
            }
        ];
        me.callParent();
    }
})