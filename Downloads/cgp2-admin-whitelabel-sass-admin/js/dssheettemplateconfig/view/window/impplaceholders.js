/**
 * Created by admin on 2019/7/8.
 */

Ext.define("CGP.dssheettemplateconfig.view.window.impplaceholders", {
    extend: "Ext.window.Window",
    mixins: ["Ext.ux.util.ResourceInit"],
    alias: 'widget.impPlaceholdersForm',
    record: null,//一个selector对象

    modal: true,
    closeAction: 'hidden',
    resizable: false,
    minWidth: 500,
    height: 450,
    buttonAlign: 'left',

    bodyStyle: {
        padding: '10px',
        paddingTop: '20px'
    },
    minWidth: 500,
    defaults: {
        labelWidth: 100,
        padding: '10 20 0 20',
        width: 350
    },
    validateForm: function () {
        var me = this;
        if (!me.isValid()) {
            Ext.Msg.alert('WARN', 'Requeied infomation must not be blank!');
        }
    },
    getValue: function () {
        var result = {};
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if(item.xtype=='singlegridcombo'){
                result[item.getName()] =  Ext.Object.getKeys(item.getValue())[0];
            }
            else{
                result[item.getName()] = item.getValue();
            }
        }
        return result;
    },
    bbar: [
        '->',
        {
            text: i18n.getKey('ok'),
            itemId: 'okBtn',
            iconCls: 'icon_agree',
            handler: function (btn) {

                var window = btn.ownerCt.ownerCt;
                var grid=window.grid;
                var record=window.record;
                //if(form.isValid()){
                var data = window.getValue();
                if (record) {
                    for (var i in data) {
                        record.set(i, data[i]);
                    }
                } else {
                    grid.store.add(data);
                }
                window.close();
                //}
            }
        }, {
            text: i18n.getKey('cancel'),
            iconCls: 'icon_cancel',
            handler: function (btn) {
                var window = btn.ownerCt.ownerCt.ownerCt;
                window.close();
            }
        }
    ],
    initComponent: function () {
        var me=this;
        var record=me.record;
        var createOrEdit = record ? 'edit' : 'create';
        var pageStore=Ext.create("CGP.dspagetemplateconfig.store.Dspagetemplateconfig");
        me.title=i18n.getKey(createOrEdit)+ i18n.getKey('impplaceholders');
        me.items=[
            {
                xtype: 'textfield',
                itemId: 'id',
                fieldLabel: i18n.getKey('id'),
                name: 'id',
                allowBlank: false,
                value: record ? record.get('id') : null
            },
            {
                xtype: 'numberfield',
                hideTrigger: true,
                itemId: 'index',
                fieldLabel: i18n.getKey('index'),
                name: 'index',
                allowBlank: false,
                value: record ? record.get('index') : null
            },
            {
                xtype: 'singlegridcombo',
                name: "contentType",
                fieldLabel: i18n.getKey('contentType'),
                itemId: 'contentType',
                displayField: 'pageType',
                valueField: 'pageType',
                editable: false,
                //value: record ? record.get('contentType') : null,
                listeners: {
                    render: function (comp) {
                        if (!Ext.isEmpty(me.record)) {
                            comp.store.proxy.extraParams = {
                                filter: Ext.JSON.encode([{name: "pageType", value: me.record.get('contentType'), type: "string"}])
                            }
                            comp.store.on({load: {fn: function (store, records, success, eOpts) {
                                if (success) {
                                    comp.setSingleValue(me.record.get('contentType'));
                                }
                            }, single: true}});
                        }
                    }
                },
                width: 350,
                store: pageStore,
                matchFieldWidth: false,
                multiSelect: false,
                autoScroll: true,
                gridCfg: Ext.create('CGP.dssheettemplateconfig.view.window.gridconfig',{
                    store: pageStore,
                    height: 300,
                    width: 550,
                    autoScroll: true,
                    //hideHeaders : true,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id',
                            xtype: 'gridcolumn',
                            itemId: '_id',
                            sortable: true
                        },
                        {
                            text: i18n.getKey('pageType'),
                            dataIndex: 'pageType',
                            xtype: 'gridcolumn',
                            width: 200,
                            itemId: 'pageType',
                            sortable: true,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('templateFileName'),
                            dataIndex: 'templateFileName',
                            xtype: 'gridcolumn',
                            itemId: 'templateFileName',
                            sortable: false,
                            width: 120,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }

                        },
                        {
                            text: i18n.getKey('description'),
                            dataIndex: 'description',
                            xtype: 'gridcolumn',
                            itemId: 'description',
                            sortable: false,
                            width: 120,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }

                        }
                    ],
                    tbar: {
                        layout: {
                            type: 'column'
                        },
                        defaults: {
                            labelWidth: 50,
                            labelAlign: 'right',
                            width: 170,
                            isLike: false,
                            padding: 2
                        },

                        items: [
                            {
                                name: '_id',
                                xtype: 'numberfield',
                                hideTrigger: true,
                                fieldLabel: i18n.getKey('id'),
                                itemId: 'idSearchField'
                            },
                            {
                                name: 'pageType',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('pageType'),
                                itemId: 'pageTypeSearch'
                            }
                        ]
                    },
                    bbar:Ext.create('Ext.PagingToolbar', {
                        store: me.store,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    })
                })
            },
            {
                xtype: 'numberfield',
                hideTrigger: true,
                itemId: 'contentSortOrder',
                fieldLabel: i18n.getKey('contentSortOrder'),
                name: 'contentSortOrder',
                value: record ? record.get('contentSortOrder') : null
            },
            {
                xtype: 'numberfield',
                hideTrigger: true,
                itemId: 'x',
                fieldLabel: i18n.getKey('x'),
                name: 'x',
                value: record ? record.get('x') : null
            },
            {
                xtype: 'numberfield',
                hideTrigger: true,
                itemId: 'y',
                fieldLabel: i18n.getKey('y'),
                name: 'y',
                value: record ? record.get('y') : null
            },
            {
                xtype: 'numberfield',
                hideTrigger: true,
                itemId: 'width',
                fieldLabel: i18n.getKey('width'),
                name: 'width',
                value: record ? record.get('width') : null
            },
            {
                xtype: 'numberfield',
                hideTrigger: true,
                itemId: 'height',
                fieldLabel: i18n.getKey('height'),
                name: 'height',
                value: record ? record.get('height') : null
            },
            {
                xtype: 'numberfield',
                hideTrigger: true,
                itemId: 'rotate',
                fieldLabel: i18n.getKey('rotate'),
                name: 'rotate',
                value: record ? record.get('rotate') : null
            }
        ];
        me.callParent();
    }
})
