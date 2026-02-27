
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.ManagerPageContentSchemaGroup', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    modal: true,
    constrain:true,
    maximizable:true,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('pageContentSchemaGroup');
        var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.store.PageContentSchemaGroup');
        var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
        me.listeners = {
            close: function(){
                me.store.load();
            }
        };
        var grid = Ext.create('CGP.common.commoncomp.QueryGrid', {
            header: false,
            width: 600,
            height: 500,
            gridCfg: {
                editAction: false,
                deleteAction: false,
                selType: 'rowmodel',
                store: store,
                tbar: [
                    {
                        xtype: 'button',
                        text: i18n.getKey('add'),
                        handler: function () {
                            controller.editPageContentSchemaGroupWin(null, store, me.productConfigDesignId,me.productConfigDesignRecord);
                        }
                    }
                ],
                multiSelect: true,
                defaults: {
                    width: 200
                },
                columns: [
                    {
                        xtype: 'actioncolumn',
                        itemId: 'actioncolumn',
                        sortable: false,
                        resizable: false,
                        width: 70,
                        menuDisabled: true,
                        items: [
                            {
                                iconCls: 'icon_edit icon_margin',
                                itemId: 'actionedit',
                                tooltip: i18n.getKey('edit') + i18n.getKey('productMaterialViewType'),
                                handler: function (view, rowIndex, colIndex, a, b, record) {
                                    controller.editPageContentSchemaGroupWin(record, store, me.productConfigDesignId,me.productConfigDesignRecord);
                                }
                            },
                            {
                                iconCls: 'icon_remove icon_margin',
                                itemId: 'actionedit',
                                tooltip: i18n.getKey('delete') + i18n.getKey('productMaterialViewType'),
                                handler: function (view, rowIndex, colIndex, a, b, record) {
                                    controller.deletePageContentSchemaGroup(record.getId(), store);
                                }
                            }
                        ]},
                    {
                        dataIndex: '_id',
                        text: i18n.getKey('id'),
                        itemId: '_id',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    },{
                        text: i18n.getKey('RtTypeId'),
                        width : 120,
                        dataIndex: 'rtType',
                        xtype : "componentcolumn",
                        renderer: function (value, metadata, record) {
                            metadata.tdAttr = 'data-qtip="' + '查看RtType' + '"';
                            return {
                                xtype : 'displayfield',
                                value : '<a href="#")>'+value['_id']+'</a>',
                                listeners : {
                                    render : function(display){
                                        display.getEl().on("click",function(){
                                            JSOpen({
                                                id: 'rttypespage',
                                                url: path + "partials/rttypes/rttype.html?rtType="+value['_id'],
                                                title: 'RtType',
                                                refresh: true
                                            })
                                        });
                                    }
                                }
                            };
                        }
                    }
                ]
            },
            filterCfg: {
                height: 60,
                header: false,
                defaults: {
                    width: 280
                },
                items: [
                    {
                        name: '_id',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('id'),
                        itemId: '_id',
                        isLike: false
                    },
                    {
                        name: 'productConfigDesignId',
                        xtype: 'numberfield',
                        hidden: true,
                        value: me.productConfigDesignRecord.getId(),
                        fieldLabel: i18n.getKey('productConfigDesignId'),
                        itemId: 'productConfigDesignId'
                    }
                ]
            }
        });
        me.items = [grid];
        me.callParent(arguments);
    }
});