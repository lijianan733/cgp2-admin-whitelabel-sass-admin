/**
 * Created by admin on 2020/8/17.
 */
Ext.define('CGP.orderlineitem.view.jobtaskdistribute.view.PlaceHolders',{
    extend: "Ext.form.Panel",
    layout: {
        type: 'table',
        columns: 2
    },
    bodyStyle: 'padding:10px',
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 120,
        msgTarget: 'side',
        validateOnChange: false
    },
    data:null,

    initComponent:function(){
        var me=this;
        var placeHolderStore=Ext.create("CGP.orderlineitem.view.jobtaskdistribute.store.PlaceHolders");
        me.items=[
            {
                name: 'placeHolders',
                //allowBlank: false,
                xtype: 'gridfield',
                itemId: 'placeHolders',
                gridConfig:{
                    renderTo:'placeHolderGrid',
                    store: placeHolderStore,
                    height: 300,
                    width: 600,
                    columns: [
                        {
                            xtype: 'rownumberer'
                        },
                        {
                            text: i18n.getKey('contentid'),
                            dataIndex: 'id',
                            xtype: 'gridcolumn',
                            itemId: 'contentid',
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('sortOrder'),
                            dataIndex: 'sortOrder',
                            xtype: 'gridcolumn',
                            itemId: 'sortOrder',
                            sortable: true
                        },
                        {
                            text: i18n.getKey('contentTypeId'),
                            dataIndex: 'contentTypeId',
                            xtype: 'gridcolumn',
                            itemId: 'contentTypeId',
                            width: 80,
                            sortable: true
                        },
                        {
                            text: i18n.getKey('contentSortOrder'),
                            dataIndex: 'contentSortOrder',
                            xtype: 'gridcolumn',
                            itemId: 'contentSortOrder',
                            width: 120,
                            renderer: function (value, metadata, record) {
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('isSignature'),
                            dataIndex: 'isSignature',
                            xtype: 'gridcolumn',
                            itemId: 'isSignature',
                            width: 120,
                            renderer: function (value, metadata, record) {
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('composingElement'),
                            dataIndex: 'composingElement',
                            xtype: 'gridcolumn',
                            itemId: 'composingElement',
                            width: 120,
                            renderer: function (value, metadata, record) {
                                var val=value?value['_id']:'';
                                return val;
                            }
                        },
                        {
                            text: i18n.getKey('positionInitialized'),
                            dataIndex: 'positionInitialized',
                            xtype: 'gridcolumn',
                            itemId: 'positionInitialized',
                            width: 120,
                            renderer: function (value, metadata, record) {
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('x'),
                            dataIndex: 'x',
                            xtype: 'gridcolumn',
                            itemId: 'x',
                            width: 120,
                            renderer: function (value, metadata, record) {
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('y'),
                            dataIndex: 'y',
                            xtype: 'gridcolumn',
                            itemId: 'y',
                            width: 120,
                            renderer: function (value, metadata, record) {
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('width'),
                            dataIndex: 'width',
                            xtype: 'gridcolumn',
                            itemId: 'width',
                            width: 120,
                            renderer: function (value, metadata, record) {
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('height'),
                            dataIndex: 'height',
                            xtype: 'gridcolumn',
                            itemId: 'height',
                            width: 120,
                            renderer: function (value, metadata, record) {
                                return value;
                            }
                        }
                    ]
                }

            }
        ];
        me.callParent(arguments);
    },

    listeners: {
        afterrender:function(comp){
            var me=this;
            if(me.data){
                me.setValue(me.data);
            }
        }
    },
    setValue: function (data) {
        var me=this;
        var items = me.items.items;
        items[0].setSubmitValue(data);
    }
})