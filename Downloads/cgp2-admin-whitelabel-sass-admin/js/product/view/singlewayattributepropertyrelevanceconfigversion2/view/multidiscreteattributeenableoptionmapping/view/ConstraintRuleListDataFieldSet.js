/**
 * Created by nan on 2019/11/22.
 * 用grid列表自己添加情况新建
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.ConstraintRuleListDataFieldSet', {
    extend: 'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.DiyFieldSet',
    alias: 'widget.constraintRuleListDataFieldSet',
    productId: null,
    layout: 'fit',
    maxHeight: 400,
    isInclude: true,
    checkOnly: false,//是否只能查看
    skuAttributeStore: null,
    isValid: function () {
        var me = this;
        var grid = me.items.items[0];
        var editor = grid.editingPlugin.getEditor();
        if (grid.store.getCount() == 0) {
            Ext.Msg.alert(i18n.getKey('prompt'), '属性组合列表不予许为空');
            return false;
        } else if (editor.hidden == false && editor.completeEdit() == false) {
            Ext.Msg.alert(i18n.getKey('prompt'), '请先完成属性组合的编辑');
            return false;
        } else {
            return true;
        }
    },
    /**
     * 将数据组合成要求的格式
     * @returns {*}
     */
    getValue: function () {
        var me = this;
        var grid = me.items.items[0];
        var rules = [];
        for (var i = 0; i < grid.store.data.items.length; i++) {
            var itemData = grid.store.data.items[i].data;
            var list = [];
            for (var j in itemData) {
                list.push({
                    clazz:'com.qpp.cgp.domain.attributemapping.enableoption.AttributeEnableOption',
                    skuAttributeId: j,
                    optionId: itemData[j]
                })
            }
            rules.push({
                clazz: 'com.qpp.cgp.domain.attributemapping.enableoption.AttributeKeyValueList',
                list: list
            })
        }
        return {
            rules: rules,
            isInclude: me.isInclude,
            executeCondition: null
        }
    },
    /**
     * 将数据组合成要求的格式
     * @param data
     */
    setValue: function (data) {
        var me = this;
        var rules = [];
        var isInclude = data.isInclude;
        var grid = me.items.items[0];
        var toolbar = grid.getDockedItems('toolbar[dock="top"]')[0];
        var isIncludeCheckBoxGroup = toolbar.getComponent('isInclude');
        for (var i = 0; i < data.rules.length; i++) {
            var rule = data.rules[i];
            var list = rule.list;
            var itemData = {};
            for (var j = 0; j < list.length; j++) {
                itemData[list[j].skuAttributeId] = list[j].optionId;
            }
            rules.push(itemData);
        }
        grid.store.proxy.data = rules;
        grid.store.load();
        isIncludeCheckBoxGroup.setValue({
            isInclude: isInclude
        })
    },
    initComponent: function () {
        var me = this;
        var columns = [
            {
                xtype: 'rownumberer',
                tdCls: 'vertical-middle'
            }, {
                xtype: 'actioncolumn',
                width: 30,
                items: [
                    {
                        iconCls: 'icon_remove icon_margin',
                        tooltip: 'Delete',
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var store = view.getStore();
                            Ext.Msg.confirm('提示', '确定删除？', callback);

                            function callback(id) {
                                if (id === 'yes') {
                                    store.remove(record)
                                }
                            }
                        }
                    }
                ]
            }
        ];
        var fields = [];
        for (var i = 0; i < me.skuAttributeStore.data.items.length; i++) {
            var skuAttribute = me.skuAttributeStore.data.items[i].getData();
            if (Ext.Array.contains(me.selectedSkuAttributeIds, skuAttribute.id)) {
                fields.push(skuAttribute.id + '');
                columns.push({
                    tdCls: 'vertical-middle',
                    width: 150,
                    dataIndex: skuAttribute.id + '',
                    skuAttribute: skuAttribute,
                    text: i18n.getKey(skuAttribute.displayName),
                    renderer: function (value, mete, record) {
                        var options = mete.column.skuAttribute.options;
                        for (var j = 0; j < options.length; j++) {
                            if (options[j].id == value) {
                                mete.tdAttr = 'data-qtip="' + options[j].name + '"';//显示的文本
                                return options[j].name;
                            }
                        }
                    },
                    editor: {
                        xtype: 'combo',
                        allowBlank: false,
                        displayField: 'name',
                        valueField: 'id',
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            data: skuAttribute.attribute.options,
                            fields: [
                                'displayValue',
                                'id',
                                'imageUrl',
                                'name',
                                'value'
                            ]
                        })
                    }
                });
            }
        }
        var store = Ext.create('Ext.data.Store', {
            fields: fields,
            proxy: {
                type: 'memory'
            },
            data: []
        });
        me.items = [
            {
                xtype: 'grid',
                store: store,
                width: 600,
                fields: fields,
                maxHeight: 350,
                height: 200,
                autoScroll: true,
                margin: '20 20 20 20',
                viewConfig: {
                    enableTextSelection: true,
                    stripeRows: true
                },
                plugins: Ext.create('Ext.grid.plugin.RowEditing', {
                    clicksToEdit: 1,
                    autoCancel: false
                }),
                listeners: {
                    afterrender: function () {
                        var editor = this.editingPlugin.getEditor();
                        editor.form.on('validitychange', function (form, isValid) {
                            editor.updateButton(isValid);
                        })
                    },
                    validateedit: function () {
                        var rowIdx = arguments[1].rowIdx;
                        var newValue = arguments[1].newValues;
                        var store = arguments[1].store;
                        var fields = arguments[1].grid.fields;
                        var isValid = true;
                        for (var i in newValue) {
                            if (!Ext.Array.contains(fields, i)) {
                                delete newValue[i];
                            }
                        }
                        for (var i = 0; i < store.data.items.length; i++) {
                            var item = store.data.items[i].data;
                            if (i == rowIdx) {
                                continue;
                            }
                            isValid = !Ext.Object.equals(item, newValue);
                            if (isValid == false) {
                                Ext.Msg.alert(i18n.getKey('prompt'), '该选项组合已经存在');
                                break;
                            }
                        }
                        return isValid;
                    }
                },
                selModel: 'cellmodel',
                tbar: {
                    hidden: me.checkOnly == true,
                    items: [
                        {
                            xtype: 'button',
                            text: i18n.getKey('add'),
                            iconCls: 'icon_add',
                            handler: function (btn) {
                                var grid = btn.ownerCt.ownerCt;
                                grid.store.add({});
                                var rowIndex = grid.store.data.items.length - 1;
                                grid.editingPlugin.startEdit(rowIndex, 1);

                            }
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('clear'),
                            iconCls: 'icon_clear',
                            handler: function (btn) {
                                var grid = btn.ownerCt.ownerCt;
                                grid.store.proxy.data = [];
                                grid.store.removeAll();
                            }
                        }, {
                            xtype: 'radiogroup',
                            columns: 2,
                            flex: 1,
                            name: 'isInclude',
                            itemId: 'isInclude',
                            vertical: true,
                            items: [
                                {boxLabel: '启用以下项组合', name: 'isInclude', inputValue: true, checked: true},
                                {boxLabel: '禁用以下选项组合', name: 'isInclude', inputValue: false}
                            ],
                            listeners: {
                                change: function (btn, newValue, oldValue) {
                                    btn.ownerCt.ownerCt.ownerCt.isInclude = newValue.isInclude;
                                }
                            }
                        }
                    ]
                },
                columns: columns
            }
        ];
        me.callParent();
    }
})

