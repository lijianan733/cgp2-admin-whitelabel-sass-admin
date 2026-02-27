/**
 * Created by admin on 2019/9/29.
 */
/**
 * Created by admin on 2019/9/29.
 */
Ext.define('CGP.redodetails.view.RedoLineItems', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.redolineitem',
    itemId:'redoItemList',
    store:Ext.create('CGP.redodetails.store.RedoItemView'),
    mainRenderer: Ext.create('CGP.redodetails.view.RedoRender'),
    viewConfig: {
        enableTextSelection: true
    },
    autoScroll: true,

    initComponent: function () {
        var me = this,
            mainRenderer = this.mainRenderer;

        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                //style: 'background-color:silver;',
                color: 'black',
                bodyStyle: 'border-color:white;',
                border: '1 0 0 0',
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: false,
                        value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('redo')+ i18n.getKey('orderLineItem') + '</font>'
                    }
                ]

            }
        ];
        me.columns = {
            items: [
                //delete redo item
                {
                    xtype: 'actioncolumn',
                    //itemId: 'actioncolumn',
                    width: 60,
                    items: [
                        {
                            iconCls: 'icon_remove',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex, item, e, record, row) {
                                Ext.MessageBox.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (option) {
                                    if (option == "yes") {
                                        me.store.remove(record);
                                        if(me.store.getCount()<1){
                                            Ext.getCmp('saveRedoOrder').setDisabled(false);
                                            Ext.getCmp('saveRedoItem').setDisabled(true);
                                        }
                                    }
                                });
                            }
                        }
                    ]
                },
                //original item info
                {
                    dataIndex: 'originalOrderItemId',
                    width: 230,
                    text: i18n.getKey('original')+i18n.getKey('orderItemInfo'),
                    renderer: function (value, metadata, record) {
                        return mainRenderer.renderOriginalInfo(value, record, metadata);
                    }
                },
                //redoType
                {
                    dataIndex: 'redoType',
                    text: i18n.getKey('redo')+i18n.getKey('type'),
                    width: 120,
                    renderer: function (value, metadata, record) {
                        var detailsComp = me.ownerCt;
                        return mainRenderer.renderRedoType(value, metadata, record, detailsComp);
                    }
                },
                //redo item info
                {
                    dataIndex: 'productName',
                    text: i18n.getKey('information'),
                    width: 300,
                    renderer: function (value, metadata, record) {
                        return mainRenderer.renderRedoItemInfo(value, metadata, record);
                    }
                },
                //redo item number
                {
                    xtype: 'componentcolumn',
                    dataIndex: 'qty',
                    width: 300,
                    text: i18n.getKey('number'),
                    renderer: function (value, metadata, record) {
                        return mainRenderer.renderQty(value, metadata, record,me);
                    }
                }
            ],
            defaults: {
                tdCls: 'vertical-middle',
                sortable: false,
                menuDisabled: true
            }
        }

        me.callParent(arguments);
    }

})