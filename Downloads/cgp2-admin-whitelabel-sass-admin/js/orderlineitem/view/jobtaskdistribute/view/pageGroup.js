/**
 * Created by admin on 2020/8/13.
 */
Ext.define('CGP.orderlineitem.view.jobtaskdistribute.view.PageGroup', {
    extend: 'Ext.form.Panel',
    alias: 'widget.pagegroup',
    requires:['Ext.ux.form.GridField'],
    defaultType: 'displayfield',
    bodyStyle: 'border-color:white;',
    header: false,
    width:'100%',
    padding:10,
    defaults: {
        labelAlign: 'right'
    },

    initComponent: function () {
        var me = this;
        var pageStore=Ext.create("CGP.orderlineitem.view.jobtaskdistribute.store.PageLocal");
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
                        value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('pageGroup') + '</font>'
                    }
                ]

            }
        ];
        me.items=[
            {
                name: 'jobBatchIds',
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('jobBatchIds'),
                itemId: 'jobBatchIds'
            },
            {
                name: 'pages',
                xtype: 'gridfield',
                fieldLabel: i18n.getKey('pages'),
                itemId: 'pages',
                gridConfig:{
                    renderTo:'pagesGrid',
                    store: pageStore,
                    maxHeight: 300,
                    width: 900,
                    columns: [
                        {
                            xtype: 'rownumberer'
                        },
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id',
                            xtype: 'gridcolumn',
                            itemId: '_id',
                            sortable: true
                        },
                        {
                            text: i18n.getKey('file')+i18n.getKey('md5'),
                            dataIndex: 'content',
                            xtype: 'gridcolumn',
                            itemId: 'content',
                            flex: 1,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('qty'),
                            dataIndex: 'qty',
                            xtype: 'gridcolumn',
                            itemId: 'qty',
                            width: 120,
                            sortable: true
                        },
                        {
                            text: i18n.getKey('sortOrder'),
                            dataIndex: 'sortOrder',
                            xtype: 'gridcolumn',
                            itemId: 'sortOrder',
                            width: 120,
                            sortable: true
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
                            text: i18n.getKey('status'),
                            dataIndex: 'status',
                            xtype: 'gridcolumn',
                            itemId: 'status',
                            width: 120,
                            sortable: true
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: pageStore,
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
//    listeners: {
//        afterrender:function(comp){
//            var me=this;
//            if(me.data){
//                me.setValue(me.data);
//            }
//        }
//    },
    setValue:function(data){
        var me=this;
        var items = me.items.items;
        me.data = data;
        Ext.Array.each(items, function (item) {
            if(item.xtype=='gridfield'){
                item.setSubmitValue(data[item.name]);
            }
            else{
                item.setValue(data[item.name]);
            }
        })
    }
})