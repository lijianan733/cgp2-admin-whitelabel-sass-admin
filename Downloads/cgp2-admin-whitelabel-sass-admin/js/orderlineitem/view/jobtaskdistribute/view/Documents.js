/**
 * Created by admin on 2020/8/13.
 */
Ext.define('CGP.orderlineitem.view.jobtaskdistribute.view.Documents', {
    extend: 'Ext.form.Panel',
    alias: 'widget.taskdoc',
    requires:['Ext.ux.form.GridField'],
    defaultType: 'displayfield',
    bodyStyle: 'border-color:white;',
    header: false,
    width: '100%',
    padding:10,
    layout: {
        type: 'table',
        columns: 2
    },
    defaults: {
        labelAlign: 'right'
    },
    initComponent: function () {
        var me = this;
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
                        value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('documents') + '</font>'
                    }
                ]

            }
        ];
        var docStore=Ext.create("CGP.orderlineitem.view.jobtaskdistribute.store.DocumentLocal");
        me.items=[
            {
                xtype:'displayfield',
                width:120
            },
            {
                name: 'documents',
                xtype: 'gridfield',
                //fieldLabel: i18n.getKey('documents'),
                itemId: 'document',
                gridConfig:{
                    renderTo:'documentGrid',
                    store: docStore,
                    maxHeight: 300,
                    width: 900,
                    columns: [
                        {
                            xtype: 'rownumberer'
                        },
                        {
                            text: i18n.getKey('content'),
                            dataIndex: 'content',
                            xtype: 'gridcolumn',
                            itemId: 'content',
                            width: 120,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('qty'),
                            dataIndex: 'qty',
                            xtype: 'gridcolumn',
                            itemId: 'qty'
                        },
                        {
                            text: i18n.getKey('width'),
                            dataIndex: 'width',
                            xtype: 'gridcolumn',
                            itemId: 'width',
                            width: 120,
                            sortable: true
                        },
                        {
                            text: i18n.getKey('height'),
                            dataIndex: 'height',
                            xtype: 'gridcolumn',
                            itemId: 'height',
                            width: 120,
                            sortable: true
                        },
                        {
                            text: i18n.getKey('barCode'),
                            dataIndex: 'barCode',
                            xtype: 'gridcolumn',
                            itemId: 'barCode',
                            width: 120,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('sheetId'),
                            dataIndex: 'sheetIds',
                            xtype: 'gridcolumn',
                            itemId: 'sheetIds',
                            width: 120,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('file'),
                            dataIndex: 'location',
                            xtype: 'gridcolumn',
                            itemId: 'location',
                            width: 120,
                            sortable: true,
                            flex:1,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: docStore,
                        disabledCls:'x-tbar-loading',
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        //emptyMsg: i18n.getKey('noData'),
                        listeners:{//去掉刷新按钮
                            afterlayout : function(comp){
                                if(comp.rendered && comp.getComponent("refresh")){
                                    comp.getComponent("refresh").hide();
                                }
                            }
                        }
                    })
                }

            }
        ];

        me.callParent(arguments);
    },
    setValue:function(data){
        var me=this;
        var items = me.items.items;
        items[1].setSubmitValue(data);
    }

})