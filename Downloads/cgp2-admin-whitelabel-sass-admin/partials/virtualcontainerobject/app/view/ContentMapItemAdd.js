Ext.define("CGP.virtualcontainerobject.view.ContentMapItemAdd", {
    extend: 'Ext.window.Window',
    alias: 'widget.contentitemadd',
    modal: true,
    constrain: true,
    layout: 'fit',

    setValue: function (data) {
        var me = this;
        var form = me.getComponent('valueEditForm');

    },
    initComponent: function () {
        var me = this;
        var controller=Ext.create('CGP.virtualcontainerobject.controller.VirtualContainerObject');
        me.title =i18n.getKey('add')+ i18n.getKey('contentMapItems');
        me.items = [
            {
                xtype: 'form',
                border: false,
                itemId: 'itemAddForm',
                defaults: {
                    padding: '5 25 5 25',
                    allowBlank: false,
                    width: 320

                },
                items: [
                    {
                        xtype: 'grid',
                        itemId:'itemsGrid',
                        minHeight: 200,
                        width: 600,
                        multiSelect: true,
                        selType: 'checkboxmodel',
                        store: Ext.create('CGP.virtualcontainerobject.store.ContentMapItem',
                            {
                                listeners:{
                                }
                            }),
                        columns:[
                            {
                                xtype: 'rownumberer',
                                text: i18n.getKey('seqNo'),
                                sortable: false,
                                width: 50
                            },
                            {
                                // xtype: 'componentcolumn',
                                text: i18n.getKey('name'),
                                sortable: false,
                                dataIndex: 'name',
                                width: 160,
                                renderer: function (value, metadata,rec) {
                                    // metadata.tdAttr = 'data-qtip ="' + value + '"';
                                    return value||rec?.raw?.name;
                                }
                            },
                            {
                                // xtype: 'componentcolumn',
                                text: i18n.getKey('required'),
                                sortable: false,
                                dataIndex: 'required',
                                width: 160,
                            }
                        ]
                    },

                ],
                bbar: [
                    '->',
                    {
                        xtype: 'button',
                        iconCls: 'icon_save',
                        text: i18n.getKey('confirm'),
                        handler: function (btn) {
                            var form = btn.ownerCt.ownerCt;
                            var win = form.ownerCt;
                            var selGrid=form.getComponent('itemsGrid');
                            var selects=selGrid.getSelectionModel().getSelection();
                            if (selects.length < 1) {
                                Ext.Msg.alert(i18n.getKey('infor'), '至少选择一条数据！');
                                return false;
                            }
                            win.contentMapGrid.store.loadData(selects,true);
                            win.close();
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: 'icon_cancel',
                        text: i18n.getKey('cancel'),
                        handler: function (btn) {
                            var form = btn.ownerCt.ownerCt;
                            var win = form.ownerCt;
                            win.close();
                        }
                    }
                ]
            }
        ];
        me.callParent();
    },
    listeners: {
        afterrender: function (win) {
            var form = win.getComponent('itemAddForm');
            var grid=form.getComponent('itemsGrid')
            if (win.contentMapGrid.rawvctItems) {
                grid.store.loadData(win.contentMapGrid.rawvctItems);
                grid.store.filter([{filterFn: function(item) { return win.contentMapGrid.store.findExact('name', item.get("name"))<0; }}]);
            }

        }
    }
});
