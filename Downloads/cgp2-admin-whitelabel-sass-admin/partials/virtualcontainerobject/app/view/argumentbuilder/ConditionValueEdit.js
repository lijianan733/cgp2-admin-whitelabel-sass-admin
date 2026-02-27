Ext.define("CGP.virtualcontainerobject.view.argumentbuilder.ConditionValueEdit", {
    extend: 'Ext.window.Window',
    alias: 'widget.conditionvalueedit',
    modal: true,
    constrain: true,
    layout: 'fit',
    createOrEdit: 'create',
    outGrid: null,
    rtAttribute: null,
    record: null,
    gridSpecialRecord: null,
    switchUrl: path + 'ClientLibs/extjs/resources/themes/images/ux/switchType.png',

    setValue: function (data) {
        var me = this;
        var form = me.getComponent('valueEditForm');
        form.items.items.forEach(function (item) {
            // if (item.getName() == 'outputValue') {
            //     var outputValue = data['outputValue'];
            //     if (me.rtAttribute.selectType == 'MULTI') {
            //         outputValue = outputValue.value.replace(/\[|\]/g, '');//去除[];
            //         outputValue = outputValue.replace(/'/g, '');//去除';
            //         if (!Ext.isEmpty(outputValue)) {
            //             outputValue = outputValue.split(',');
            //             item.setValue(outputValue);
            //         }
            //     } else {
            //         item.setValue(outputValue.value);
            //     }
            // } else {
            //     item.setValue(data[item.getName()]);
            // }
            item.setValue(data[item.getName()]);
        })

    },
    reset: function () {
        var me = this;
        var form = me.getComponent('valueEditForm');
        form.el.mask('loading..');
        setTimeout(function () {
            if (me.record) {
                me.setValue(me.record.getData());
            } else {
                me.setValue({
                    clazz: 'com.qpp.cgp.domain.product.config.material.mapping2dto.MappingRule',
                    outputValue: {
                        clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                        value: null
                    },
                    condition: {
                        conditionType: "simple",
                        clazz: "com.qpp.cgp.domain.executecondition.InputCondition",
                        operation: {
                            operator: "AND",
                            operations: [],
                            clazz: "com.qpp.cgp.domain.executecondition.operation.LogicalOperation"
                        }
                    }
                })
            }
            form.el.unmask('loading..');
        }, 100)
    },
    initComponent: function () {
        var me = this;
        me.gridSpecialRecord = {
            else: null,
            empty: null
        };
        var controller=Ext.create('CGP.virtualcontainerobject.controller.VirtualContainerObject');
        me.title = i18n.getKey(me.createOrEdit) + i18n.getKey('value');
        var productId=JSGetQueryString('productId');
        // var excludeAttributeValue = [];//已经添加了的属性值列表
        // for (var i = 0; i < me.outGrid.store.getCount(); i++) {
        //     var record = me.outGrid.store.getAt(i);
        //     var value = record.get('outputValue').value;
        //     var condition = record.get('condition');
        //     if (value) {//固定值
        //         if (me.record && value == me.record.raw.outputValue.value) {
        //             //不过滤掉编辑状态的原来的值
        //         } else {
        //             excludeAttributeValue.push(me.outGrid.store.data.items[i].raw.outputValue.value);
        //         }
        //     }
        //     if (condition && condition.conditionType == 'else') {
        //         me.gridSpecialRecord.else = record;
        //     } else if (Ext.isEmpty(condition)) {
        //         me.gridSpecialRecord.empty = record;
        //     }
        // }
        me.items = [
            {
                xtype: 'form',
                border: false,
                itemId: 'valueEditForm',
                defaults: {
                    padding: '5 25 5 25',
                    allowBlank: false,
                    width: 320

                },
                items: [
                    {
                        name: 'description',
                        text: i18n.getKey('description'),
                        itemId: 'description',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('description')
                    },
                     controller.createConditionValueComp('outputValue',me.rtAttribute,me.record),
                    {
                        xtype: 'conditionfieldcontainer',
                        name: 'condition',
                        itemId: 'condition',
                        maxHeight: 350,
                        width: 800,
                        minHeight: 80,
                        fieldLabel: i18n.getKey('condition'),
                        productId:productId
                    }
                ],
                bbar: [
                    {
                        xtype: 'button',
                        iconCls: 'icon_reset',
                        text: i18n.getKey('reset'),
                        handler: function (btn) {
                            var form = btn.ownerCt.ownerCt;
                            var win = form.ownerCt;
                            win.reset();
                        }
                    },
                    '->',
                    {
                        xtype: 'button',
                        iconCls: 'icon_save',
                        text: i18n.getKey('confirm'),
                        handler: function (btn) {
                            var form = btn.ownerCt.ownerCt;
                            var win = form.ownerCt;
                            var isValid = true;
                            form.items.items.forEach(function (item) {
                                if (item.disabled == false) {
                                    if (item.isValid() == false) {
                                        isValid = false;
                                    }
                                }
                            });
                            if (isValid == true) {
                                var data = {};
                                form.items.items.forEach(function (item) {
                                    if (item.disabled == false) {
                                        data[item.getName()] = item.getValue()
                                    }
                                });
                                console.log(data);
                                data.clazz = 'com.qpp.cgp.domain.product.config.material.mapping2dto.MappingRule';

                                if (win.createOrEdit == 'create') {
                                    if (data.condition && data.condition.conditionType == 'else') {
                                        if (me.gridSpecialRecord.else) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('其他条件都不成立时执行的配置已经存在!'));
                                            return;
                                        }
                                    } else if (Ext.isEmpty(data.condition)) {
                                        if (me.gridSpecialRecord.empty) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('无条件执行的配置已经存在!'));
                                            return;
                                        }
                                    }
                                    win.outGrid.store.proxy.data.push(data);
                                } else {
                                    if (data.condition && data.condition.conditionType == 'else') {
                                        if (me.gridSpecialRecord.else && win.record != me.gridSpecialRecord.else) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('其他条件都不成立时执行的配置已经存在!'));
                                            return;
                                        }
                                    } else if (Ext.isEmpty(data.condition)) {
                                        if (me.gridSpecialRecord.empty && win.record != me.gridSpecialRecord.empty) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('无条件执行的配置已经存在!'));
                                            return;
                                        }
                                    }
                                    win.outGrid.store.proxy.data[win.record.index] = data;
                                }
                                // //触发修改事件
                                // var centerContainer = Ext.getCmp('productMaterialMappingV3_CenterContainer');
                                // if (centerContainer) {
                                //     centerContainer.fireEvent('dirty');
                                // }
                                win.outGrid.store.load();
                                win.close();
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: 'icon_cancel',
                        text: i18n.getKey('cancel'),
                        handler: function (btn) {
                            var form = btn.ownerCt.ownerCt;
                            var win = form.ownerCt;
                            win.close();
                        }
                    }
                ]
            }
        ];
        me.callParent();
    },
    listeners: {
        afterrender: function (win) {
            var form = win.getComponent('valueEditForm');
            if (win.record) {
                win.setValue(win.record.getData());
            }

        }
    }
});
