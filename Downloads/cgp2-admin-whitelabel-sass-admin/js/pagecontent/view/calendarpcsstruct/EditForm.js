/**
 *详细页
 **/
Ext.define('CGP.pagecontent.view.calendarpcsstruct.EditForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.infodetail',

    //padding: 30,
    defaultType: 'textfield',
    defaults: {
        width: 400,
        labelAlign: 'right'
    },
    layout: {
        type: 'table',
        // The total column count must be specified here
        columns: 2
    },
    bodyPadding: 10,
    color: 'black',
    bodyStyle: 'border-color:silver;',
    border: '1 0 0 0',
    //bodyBorder: '1 0 0 0',
    header: false,
    itemId: 'userParamsForm',

    initComponent: function () {
        var me = this;
        me.items = [            {
            xtype: 'uxtextarea',
            itemId: 'content',
            name: 'content',
            width: 800,
            colspan: 2,
            allowBlank: false,
            height: 300,
            fieldLabel: i18n.getKey('content'),
            toolbarConfig: {
                items: [
                    {
                        xtype: 'button',
                        text: i18n.getKey('预览'),
                        iconCls: 'x-form-search-trigger', //your iconCls here
                        handler: function (view) {
                            var win = Ext.create("Ext.window.Window", {
                                itemId: "layers",
                                layout: 'fit',
                                title: i18n.getKey('预览'),
                                modal: true,
                                width: 800,
                                height: 800,
                                html: view.ownerCt.ownerCt.textarea.getValue()
                            });
                            win.show();
                        },
                        scope: this,
                        tooltip: i18n.getKey('预览'),
                        overflowText: i18n.getKey('预览')
                    }, {
                        xtype: 'filefield',
                        buttonOnly: true,
                        buttonConfig: {
                            iconCls: 'icon_folder',
                            text: i18n.getKey('上传')
                        },
                        listeners: {
                            change: function (comp, newValue, oldValue) {
                                var file = this.fileInputEl.dom.files[0];
                                var that =this;
                                var reader = new FileReader();
                                reader.addEventListener('load', function (evt) {
                                    if(that.activeErrors == null) {
                                        me.getComponent('content').setValue(evt.target.result);
                                    }
                                });
                                reader.readAsText(file,'UTF-8');
                            }
                        }
                    }
                ]
            }
        }, {
            xtype: 'textfield',
            name: 'name',
            allowBlank: false,
            itemId: 'name',
            fieldLabel: i18n.getKey('name')
        },{
            xtype: 'textfield',
            name: 'description',
            itemId: 'description',
            fieldLabel: i18n.getKey('description')
        },             {
            name: 'transform',
            xtype: 'uxfieldset',
            itemId: 'transform',
            colspan: 2,
            margin: '0 0 0 50',
            width: 500,
            title: i18n.getKey('transform'),
            legendItemConfig: {
                disabledBtn: {
                    isUsable: false,
                    hidden: false,
                    disabled: false,
                }
            },
            layout: {
                type: 'table',
                columns: 2
            },
            diyGetValue: function () {
                var me = this;
                if (me.legend.getComponent('disabledBtn').isUsable == false) {
                    return null;
                } else {
                    var result = [];
                    for (var i = 0; i < me.items.items.length; i++) {
                        result.push(me.items.items[i].getValue());
                    }
                    return result;
                }
            },
            diySetValue: function (data) {
                var me = this;
                me.suspendLayouts();
                var disabledBtn = me.legend.getComponent('disabledBtn');
                if (data) {
                    for (var i = 0; i < me.items.items.length; i++) {
                        me.items.items[i].setValue(data[i]);
                    }
                    disabledBtn.count = 1;
                    disabledBtn.handler();
                } else {
                    disabledBtn.count = 0;
                    disabledBtn.handler();
                }
                me.resumeLayouts();
                me.updateLayout();
            },
            defaults: {
                xtype: 'numberfield',
                allowBlank: false,
                labelWidth: 50,
                decimalPrecision: 5,
                labelAlign: 'right',
                flex: 1
            },
            items: [
                {
                    fieldLabel: "A"
                },
                {
                    fieldLabel: "B"
                },
                {
                    fieldLabel: "C"

                },
                {
                    fieldLabel: "D"

                },
                {
                    fieldLabel: "E"

                },
                {
                    fieldLabel: "F"
                }
            ]

        },{
            xtype: 'textfield',
            name: 'clazz',
            itemId: 'clazz',
            hidden: true,
            fieldLabel: 'clazz'
        }, {
            xtype: 'combo',
            hidden: true,
            name: 'arrangeRule',
            store: Ext.create('Ext.data.Store', {
                fields: ['name', {name: 'value', type: 'string'}],
                data: [{
                    name: i18n.getKey('LeftToRight'),
                    value: 'LeftToRight'
                }, {
                    name: i18n.getKey('RightToLeft'),
                    value: 'RightToLeft'
                }, {
                    name: i18n.getKey('TopToBottom'),
                    value: 'TopToBottom'
                }, {
                    name: i18n.getKey('BottomToTop'),
                    value: 'BottomToTop'
                },]
            }),
            displayField: 'name',
            value: 'LeftToRight',
            valueField: 'value',
            allowBlank: false,
            editable: false,
            colspan: 2,
            queryMode: 'local',
            itemId: 'arrangeRule',
            fieldLabel: i18n.getKey('arrangeRule')
        }];

        me.title = i18n.getKey('information');

        me.callParent(arguments);

    },
    /*    refreshData: function (data) {
            var me = this;
            Ext.Array.each(me.items.items, function (item) {
                if (item.name == 'parentId') {
                    if (data.parentMaterialType) {
                        item.setValue(data.parentMaterialType['_id']);
                        item.setVisible(true);
                    }
                } else if (item.name == 'type') {
                    item.setValue(data.clazz.split('.').pop());
                } else {
                    if(!Ext.isEmpty(data[item.name])){
                        item.setValue(data[item.name]);
                    }
                }
            });

        },*/
    getValue: function () {
        var me = this;
        var resultData = {};
        if(me.isValid()){
            var items = me.items.items;
            Ext.Array.each(items, function (item) {
                if(item.name == 'transform'){
                    resultData[item.name] = item.diyGetValue();
                }else{
                    resultData[item.name] = item.getValue();
                }

            });
        }
        return resultData;
    }


});
