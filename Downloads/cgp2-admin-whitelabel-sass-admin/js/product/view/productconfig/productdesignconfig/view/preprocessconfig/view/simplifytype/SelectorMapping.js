/**
 * Created by admin on 2021/05/27.
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.SelectorMapping", {
    extend: 'Ext.ux.form.GridField',
    alias: 'widget.selectormapping',
    width: "100%",
    minHeight: 260,
    valueSource:"storeProxy",
    //bodyStyle:'overflow-x:visible;overflow-y:auto;',
    data: null,
    initComponent: function () {
        var me = this;
        var store = Ext.create('Ext.data.Store', {
                fields: [
                    {name: "right", type: 'object'},
                    {name: 'left',type: "object"},
                    'leftSelector', 'rightSelector'],
                pageSize: 10,
                data:me.data,
                proxy: {
                    type: 'pagingmemory'
                }
            });
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.controller.Controller');
        me.gridConfig = {
            renderTo: JSGetUUID(),
            // multiSelect: true,
            // selType: 'checkboxmodel',
            store: store,
            minHeight: 260,
            //maxHeight: 360,
            width: 650,
            defaults: {
                width: 60
            },
            tbar: [
                {
                    text: i18n.getKey('add'),
                    itemId: 'add',
                    iconCls: 'icon_add',
                    handler: function (el) {
                        var grid = el.ownerCt.ownerCt;
                        // var compLeft=grid.ownerCt.getComponent('left');
                        // var compRight=grid.ownerCt.getComponent('right');
                        controller.editMapping(me, null);
                    }
                }
            ],
            columns: [
                {xtype: 'rownumberer'},
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    width: 60,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                var index = store.pageSize * (store.currentPage - 1) + rowIndex
                                Ext.Array.splice(store.proxy.data, index, 1);
                                store.load();
                            }
                        },
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: 'Edit',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                var record = store.getAt(rowIndex);
                                var index = store.pageSize * (store.currentPage - 1) + rowIndex;
                                controller.editMapping(me, record,index);
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('leftMVT'),
                    width: 100,
                    dataIndex: 'left',
                    renderer: function (value, metadata, record) {
                        return value._id;
                    }
                },
                {
                    text: i18n.getKey('rightMVT'),
                    width: 100,
                    dataIndex: 'right',
                    renderer: function (value, metadata, record) {
                        return value._id;
                    }
                },
                {
                    text: i18n.getKey('leftSelector'),
                    dataIndex: 'leftSelector',
                    width: 100,
                    renderer: function (value, metadata, record) {
                        var valueExp=value.expression
                        return controller.extractValue(valueExp);
                    }
                },
                {
                    text: i18n.getKey('rightSelector'),
                    dataIndex: 'rightSelector',
                    width: 100,
                    flex:1,
                    renderer: function (value, metadata, record) {
                        var valueExp=value.expression
                        return controller.extractValue(valueExp);
                    }
                }
            ],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: store,
                disabledCls: 'x-tbar-loading',
                displayInfo: true, // 是否 ? 示， 分 ? 信息
                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息

            }),

        }
        me.callParent(arguments);
    }

});
