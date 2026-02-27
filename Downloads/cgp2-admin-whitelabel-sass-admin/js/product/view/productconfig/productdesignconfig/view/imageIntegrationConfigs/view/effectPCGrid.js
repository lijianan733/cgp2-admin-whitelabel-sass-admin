/**
 * effectPCGrid
 * @Author: miao
 * @Date: 2022/4/1
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.view.effectPCGrid", {
    extend: "Ext.ux.form.GridField",
    alias: 'widget.effectgrid',

    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
        me.gridConfig = {
            renderTo: JSGetUUID(),
            selModel:{
                mode:'SINGLE'
            },
            width: '100%',
            store:me.store,
            tbar: [
                {
                    text: i18n.getKey('addOption'),
                    iconCls: 'icon_create',
                    handler: function (btn) {
                        var store = btn.ownerCt.ownerCt.store;
                        controller.editImageUrl(me.pmvtId, null, store);
                    }
                }
            ],
            columns: [
                {
                    xtype: 'actioncolumn',
                    width: 60,
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: 'Edit',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                var record = store.getAt(rowIndex);
                                controller.editImageUrl(me.pmvtId, record, store);
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                var record = store.getAt(rowIndex);
                                store.remove(record);
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('effect'),
                    width: 200,
                    sortable: false,
                    dataIndex: 'effect'
                },
                {
                    text: i18n.getKey('imagePageContentPaths'),
                    flex: 1,
                    sortable: false,
                    dataIndex: 'imagePageContentPaths',
                    renderer: function (value, metadata, record) {
                        var dispalyValue = value.join(' | ')
                        metadata.tdAttr = 'data-qtip="' + dispalyValue + '"';
                        return dispalyValue;
                    }
                }
            ]
        };
        me.callParent(arguments);
    }

});