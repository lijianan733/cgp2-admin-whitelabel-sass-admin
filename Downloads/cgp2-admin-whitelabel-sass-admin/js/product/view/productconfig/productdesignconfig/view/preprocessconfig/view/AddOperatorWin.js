Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.AddOperatorWin', {
    extend: 'Ext.window.Window',
    modal: true,
    layout: 'fit',
    height: 600,
    initComponent: function () {
        var me = this;
//}
        var id = {
            xtype: 'textfield',
            name: '_id',
            readOnly: true,
            fieldStyle: 'background-color:silver',
            itemId: 'id',
            fieldLabel: i18n.getKey('id')
        };
        var index = {
            name: 'index',
            xtype: 'numberfield',
            itemId: 'index',
            id: 'index',
            minValue: 0,
            fieldLabel: i18n.getKey('index'),
            allowBlank: false
        };
        var enable = {
            xtype: 'textareafield',
            name: 'enable',
            allowBlank: false,
            itemId: 'enable',
            value: 'true',
            fieldLabel: i18n.getKey('enable')
        };
        var clazz = {
            xtype: 'textfield',
            name: 'clazz',
            hidden: true,
            readOnly: true,
            fieldStyle: 'background-color:silver',
            itemId: 'clazz',
            fieldLabel: i18n.getKey('clazz')
        };
        var parserType = {
            xtype: 'combo',
            valueField: 'value',
            displayField: 'name',
            allowBlank: true,
            store: Ext.create('Ext.data.Store', {
                fields: ['name', 'value'],
                data: [
                    {
                        name: 'json',
                        value: 'json'
                    },
                    {
                        name: 'pdf',
                        value: 'pdf'
                    }
                ]
            }),
            editable: false,
            queryMode: 'local',
            value: 'json',
            name: 'parserType',
            itemId: 'parserType',
            fieldLabel: i18n.getKey('parserType')
        };
        var selector = {
            xtype: 'textareafield',
            name: 'selector',
            itemId: 'selector',
            fieldLabel: i18n.getKey('selector')
        };
        var keySelector = {
            xtype: 'textareafield',
            name: 'keySelector',
            itemId: 'keySelector',
            fieldLabel: i18n.getKey('keySelector')
        };
        var key = {
            xtype: 'textfield',
            name: 'key',
            itemId: 'key',
            fieldLabel: i18n.getKey('key')
        };
        var cycleKey = {
            xtype: 'textfield',
            name: 'cycleKey',
            allowBlank: true,
            itemId: 'cycleKey',
            fieldLabel: i18n.getKey('cycleKey')
        };
        var cycleKeyValueEx =
            {
                xtype: 'valueexfield',
                name: 'cycleKeyValueEx',
                itemId: 'cycleKeyValueEx',
                allowBlank: true,
                fieldLabel: i18n.getKey('cycleKeyValueEx'),
                commonPartFieldConfig: {
                    uxTextareaContextData: true,
                    defaultValueConfig: {
                        type: 'Number',
                        clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                        typeSetReadOnly: false,
                        clazzSetReadOnly: false

                    }
                },
                tipInfo: 'cycleKeyValueEx'
            };
        var cycleNumber = {
            xtype: 'textfield',
            name: 'cycleNumber',
            allowBlank: true,
            itemId: 'cycleNumber',
            fieldLabel: i18n.getKey('cycleNumber')
        };
        var calculateExpression = {
            xtype: 'textareafield',
            name: 'calculateExpression',
            itemId: 'calculateExpression',
            fieldLabel: i18n.getKey('calculateExpression')
        };
        var cValueEx =
            {
                xtype: 'valueexfield',
                name: 'calculateValueEx',
                itemId: 'calculateValueEx',
                allowBlank: true,
                fieldLabel: i18n.getKey('calculateValueEx'),
                commonPartFieldConfig: {
                    uxTextareaContextData: true,
                    defaultValueConfig: {
                        type: 'Boolean',
                        clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                        typeSetReadOnly: true,
                        clazzSetReadOnly: false

                    }
                },
                tipInfo: 'calculateValueEx'
            }
        var objectSelector = {
            xtype: 'textareafield',
            name: 'objectSelector',
            itemId: 'objectSelector',
            fieldLabel: i18n.getKey('objectSelector')
        };
        var arraySelector = {
            xtype: 'textareafield',
            name: 'arraySelector',
            itemId: 'arraySelector',
            fieldLabel: i18n.getKey('arraySelector')
        };
        var description = {
            xtype: 'textareafield',
            name: 'description',
            allowBlank: true,
            itemId: 'description',
            fieldLabel: i18n.getKey('description')
        };
        var graphData = {
            xtype: 'textareafield',
            name: 'graphData',
            hidden: true,
            allowBlank: true,
            itemId: 'graphData',
            fieldLabel: i18n.getKey('graphData')
        };
        /*var type = {
            xtype: 'textfield',
            name: 'key',
            itemId: 'key',
            fieldLabel: i18n.getKey('key')
        }*/
        /*var code = {
         xtype: 'textfield',
         name: 'code',
         itemId: 'code',
         fieldLabel: i18n.getKey('code')
         };*/
        var sourceType = {
            xtype: 'combo',
            valueField: 'value',
            displayField: 'name',
            store: Ext.create('Ext.data.Store', {
                fields: ['name', 'value'],
                data: [
                    {
                        name: 'Source',
                        value: 'Source'
                    },
                    {
                        name: 'Target',
                        value: 'Target'
                    }
                ]
            }),
            readOnly: true,
            editable: false,
            queryMode: 'local',
            value: 'Source',
            name: 'sourceType',
            itemId: 'sourceType',
            fieldLabel: i18n.getKey('sourceType')
        };
        var isEnable = {
            xtype: 'combo',
            valueField: 'value',
            displayField: 'name',
            store: Ext.create('Ext.data.Store', {
                fields: ['name', {name: 'value', type: 'boolean'}],
                data: [
                    {
                        name: '是',
                        value: true
                    },
                    {
                        name: '否',
                        value: false
                    }
                ]
            }),
            editable: false,
            queryMode: 'local',
            value: true,
            name: 'isEnable',
            itemId: 'isEnable',
            fieldLabel: i18n.getKey('enable')
        };
        /*var target = {

        };*/

        me.items = [
            {
                xtype: 'form',
                padding: 20,
                width: 600,
                id: 'bomItemForm',
                border: false,
                autoScroll: true,
                defaults: {
                    width: 350,
                    allowBlank: false
                },
                listeners: {
                    beforerender: function (comp) {
                        var type = me.data.clazz;

                        if (type == 'com.qpp.cgp.domain.preprocess.operator.SourceOperatorConfig') {
                            comp.add(id, clazz, sourceType, enable, parserType, cycleNumber, cycleKey, cycleKeyValueEx, graphData, description);
                        } else if (type == 'com.qpp.cgp.domain.preprocess.operator.SelectorOperatorConfig') {
                            comp.add(id, clazz, enable, parserType, cycleNumber, selector, cycleKey, cycleKeyValueEx, graphData, description);
                        } else if (type == 'com.qpp.cgp.domain.preprocess.operator.CalculateOperatorConfig') {
                            comp.add(id, clazz, enable, parserType, cycleNumber, selector, key, cycleKey, cycleKeyValueEx, graphData, calculateExpression, description);
                        } else if (type == 'com.qpp.cgp.domain.preprocess.operator.FreeMarkerOperatorConfig') {
                            comp.add(id, clazz, enable, parserType, cycleNumber, selector, key, cycleKey, cycleKeyValueEx, graphData, calculateExpression, description);
                        } else if (type == 'com.qpp.cgp.domain.preprocess.operator.DeleteOperatorConfig') {
                            comp.add(id, clazz, enable, parserType, cycleNumber, selector, cycleKey, cycleKeyValueEx, graphData, description);
                        } else if (type == 'com.qpp.cgp.domain.preprocess.operator.InsertOperatorConfig') {
                            comp.add(id, clazz, enable, parserType, cycleNumber, key, objectSelector, cycleKey, cycleKeyValueEx, graphData, description);
                        } else if (type == 'com.qpp.cgp.domain.preprocess.operator.AddItemOperatorConfig') {
                            comp.add(id, clazz, enable, parserType, cycleNumber, index, arraySelector, cycleKey, cycleKeyValueEx, graphData, description);
                        } else if (type == 'com.qpp.cgp.domain.preprocess.operator.ReplaceOperatorConfig' || type == 'com.qpp.cgp.domain.preprocess.operator.MergerOperatorConfig') {
                            comp.add(id, clazz, enable, parserType, cycleNumber, selector, cycleKey, cycleKeyValueEx, graphData, description);
                        } else if (type == 'com.qpp.cgp.domain.preprocess.operator.CalculateValueExOperatorConfig') {
                            comp.add(id, clazz, enable, parserType, cycleNumber, selector, keySelector, key, cycleKey, cycleKeyValueEx, graphData, cValueEx, description);
                        }

                    }
                },
                items: []
            }
        ];
        me.listeners = {
            'afterrender': function (window) {


            },
            close: function () {
                if (me.selectTypeWin) {
                    //me.selectTypeWin.close();
                }
            }
        };
        me.callParent(arguments);
        me.form = me.down('form');
//me.add(contrains);
        if (!Ext.isEmpty(me.data)) {
            me.form.on('afterrender', function () {
                //抽出需要使用到uxtreecomhaspaging的组件字段
                var items = me.form.items.items;
                Ext.Array.each(items, function (item) {
                    item.setValue(me.data[item.name]);
                    if(item.name == 'enable' && Ext.isEmpty(me.data[item.name])){
                        item.setValue('true');
                    }
                })

            });
            /* var itemMaterialId = me.record.get('itemMaterial').id;
             Ext.getCmp('displayMaterial').setValue(itemMaterialId);*/
        }
    }/*,
    getCurrentTitle: function (){
        var me = this;
        var data = me.data;
        if()
    }*/
})
;
