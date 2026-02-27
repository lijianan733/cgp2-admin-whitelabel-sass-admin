/**
 * Created by admin on 2019/9/29.
 */
Ext.define('CGP.redodetails.view.OrderLineItems', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.originallineitem',
    itemId:'originallineitem',
    mainRenderer: Ext.create('CGP.redodetails.view.RedoRender'),
    store: Ext.create('CGP.redodetails.store.OrderLineItems'),

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
                border: '0 0 0 0',
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: false,
                        value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('original')+ i18n.getKey('orderLineItem') + '</font>'
                    }
                ]

            }
        ];
        me.columns = {
            items: [
                //seqNo
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 100
                },
                //product image
                {
                    dataIndex: 'productImageUrl',
                    text: i18n.getKey('image'),
                    xtype: 'componentcolumn',
                    width: 120,
                    renderer: function (value, metadata, record) {
                        var detailsComp = me.ownerCt;
                        return mainRenderer.rendererImage(value, metadata, record, detailsComp);
                    }
                },
                //product information
                {
                    dataIndex: 'productName',
                    text: i18n.getKey('product'),
                    width: 300,
                    renderer: function (value, metadata, record) {
                        return mainRenderer.renderProductInfo(value, metadata, record);
                    }
                },
                //item info
                {
                    dataIndex: 'seqNo',
                    width: 230,
                    text: i18n.getKey('orderItemInfo'),
                    renderer: function (value, record, metadata) {
                        return mainRenderer.renderItemInfo(value, record, metadata);
                    }
                },
                //redo grainSize
                {
                    dataIndex: 'id',
                    width: 230,
                    xtype: 'componentcolumn',
                    text: i18n.getKey('redo')+i18n.getKey('grainSize'),
                    renderer: function (value, metadata, record) {
                        return mainRenderer.renderRedoOperation(value, metadata, record,me);
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