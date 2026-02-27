Ext.Loader.setPath('CGP.resource', '../../../app');
Ext.define("CGP.resource.view.dynamicSizeImage.RuleGridField", {
    extend: 'Ext.ux.form.GridField',
    alias: 'widget.rulegrid',
    requires: ['CGP.resource.view.dynamicSizeImage.RuleForm',
        'CGP.resource.view.dynamicSizeImage.FillRule',
        'CGP.resource.view.dynamicSizeImage.RangeForm'
    ],
    layout:'fit',
    bodyStyle: 'padding:10px',
    Defaults: {
        width: 80
    },

    initComponent: function () {
        var me=this;
        var controller=Ext.create('CGP.resource.controller.DynamicSizeImage');
        me.store=Ext.create('CGP.resource.store.Rule');
        me.gridConfig= {
            renderTo:JSGetUUID(),
            multiSelect: true,
            selType: 'checkboxmodel',
            store: me.store,
            minHeight: 200,
            layout:'fit',
            tbar: [
                {
                    text: i18n.getKey('add'),
                    iconCls: 'icon_add',
                    itemId:'addRule',
                    handler:function (btn){
                        var ruleGrid=btn.ownerCt.ownerCt;
                        controller.addRule(ruleGrid,null);
                    }
                },
                {
                    text: i18n.getKey('delete'),
                    iconCls: 'icon_delete',
                    itemId:'deleteRule',
                    handler:function (btn){
                        var ruleGrid=btn.ownerCt.ownerCt;
                        controller.deleteRule(ruleGrid,null);
                    }
                },
            ],

            columns: [
                // {
                //     xtype: 'rownumberer',
                //     text: i18n.getKey('seqNo'),
                //     sortable: false,
                //     width: 50
                // },
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    dataIndex:'_id',
                    width: 50,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex) {
                                Ext.Msg.confirm(i18n.getKey('info'),i18n.getKey('deleteConfirm'), function (select) {
                                    if (select == 'yes') {
                                        var store = view.getStore();
                                        store.removeAt(rowIndex);
                                    }
                                });
                            }
                        },
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: 'Edit',
                            handler: function (view, rowIndex, colIndex) {

                                var store = view.getStore();
                                var record = store.getAt(rowIndex);
                                controller.addRule(view,record);
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    flex: 1,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip ="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('rule'),
                    dataIndex: 'rule',
                    width: 160,
                    renderer: function (value, metadata,record) {
                        var ruleClazz=value?.clazz,result='';
                        if(ruleClazz){
                            result=ruleClazz.substr(ruleClazz.lastIndexOf('.')+1);
                            metadata.tdAttr = 'data-qtip ="' + result + '"';
                        }
                        return result;
                    }
                },
                {
                    xtype:'componentcolumn',
                    text: i18n.getKey('sizeRange'),
                    dataIndex: 'range',
                    width: 160,
                    renderer: function (value, metadata,record) {
                        var result = null;
                        if (value) {
                            metadata.tdAttr = 'data-qtip="查看"';
                            result= {
                                xtype: 'displayfield',
                                value: '<a href="#" id="click-rule" style="color: blue">' + i18n.getKey('check') + '</a>',
                                record:record,
                                listeners: {
                                    render: function (display) {
                                        controller.showCheck(display);
                                    }
                                }
                            }
                        }
                        return result;
                    }
                }
            ]
        };
        me.callParent(arguments);
    }
})

