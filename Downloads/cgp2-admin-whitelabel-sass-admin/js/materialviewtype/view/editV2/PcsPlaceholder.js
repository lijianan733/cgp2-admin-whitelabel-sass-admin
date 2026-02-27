Ext.define("CGP.materialviewtype.view.edit.PcsPlaceholder", {
    extend: "Ext.grid.Panel",
    itemId: 'pcsPlaceholders',
    viewConfig: {
        enableTextSelection: true
    },
    defaults: {
        width: 350
    },

    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('pcsPlaceholder');
        var controller = Ext.create('CGP.materialviewtype.controller.Controller');
        me.store = Ext.create("CGP.materialviewtype.store.PcsPlaceholder", {
            data: []
        });
        me.columns=[
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                sortable: false,
                resizable: false,
                width: 70,
                tdCls: 'vertical-middle',
                menuDisabled: true,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',
                        tooltip: i18n.getKey('edit'),
                        handler: function (view, rowIndex, colIndex, a, b) {
                            var store = view.getStore();
                            var record = store.getAt(rowIndex);
                            controller.editPcsPlaceholder('edit', store, record);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actiondelete',
                        tooltip: i18n.getKey('remove'),
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var store = view.store;
                            Ext.Msg.confirm('提示', '确定删除？', callback);
                            function callback(id) {
                                if (id === 'yes') {
                                    store.removeAt(rowIndex);
                                }
                            }
                        }
                    }
                ]
            },
            {
                text: i18n.getKey('selector'),
                sortable: false,
                width: 250,
                dataIndex: 'selector',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }

            },
            {
                text: i18n.getKey('attributes'),
                dataIndex: 'attributes',
                sortable: false,
                width: 250,
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
            {
                text: i18n.getKey('description'),
                dataIndex: 'description',
                sortable: false,
                width: 250,
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
            {
                text: i18n.getKey('expression'),
                dataIndex: 'expression',
                sortable: false,
                width: 250,
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            }
        ];
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('add') + 'pcsPlaceholder',
                id: 'pcsPlaceholder',
                iconCls: 'icon_add',
                // hidden: me.data.parentId != null,
                handler: function (comp) {
                    var store = comp.ownerCt.ownerCt.getStore();
                    controller.editPcsPlaceholder('new', store, null);
                }
            }
        ];
        me.callParent(arguments);
    },
    getValue: function () {
        var me = this;
        var pcsPlaceholders = [];
        me.store.data.items.forEach(function (item) {
            var pcsPlaceholderData = item.data;
            pcsPlaceholders.push(pcsPlaceholderData);

        });
        return pcsPlaceholders;
    },

    refreshData: function (data) {
        var me = this;
        me.data = data;
        var store = me.store;
        store.removeAll();
        if(!Ext.isEmpty(data.pcsPlaceholders)){
            store.add(data.pcsPlaceholders);
        }
    }

});