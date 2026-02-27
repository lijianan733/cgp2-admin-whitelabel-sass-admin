/**
 * Created by nan on 2020/8/25.
 */
Ext.define("CGP.pagecontentschema.view.ShapeConfigFieldSet", {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.shapeconfigfieldset',
    title: 'shape',
    clazzReadOnly: null,
    legendItemConfig: {
        disabledBtn: {
            isUsable: false,
            hidden: false,
            disabled: false,
        }
    },
    defaults: {
        width: '100%',
        padding: '0 20 0 20'
    },
    padding: 0,
    data: null,
    minHeight: 30,
    onlySubProperty: false,//是否只有子属性
    listeners: {
        afterrender: function (fieldSet) {
            var me = this;
            //代理监听内部body的滚动条事件
            if (me.data) {
                me.diySetValue(me.data)
            }
        },
    },
    isValid: function () {
        var me = this;
        me.Errors = {};
        var valid = true;
       
        if (me.disabled == false && (me.legend && me.legend.getComponent('disabledBtn').isUsable)) {
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                if (item.disabled) {
                } else {
                    if (item.isValid()) {
                    } else {
                        valid = false;
                        me.Errors[item.getFieldLabel()] = item.getErrors();
                    }
                }
            }
        }
        return valid;
    },
    diyGetValue: function () {
        var me = this;
        if (me.legend.getComponent('disabledBtn').isUsable == false) {
            return null;
        } else {
            var result = Ext.Object.merge(me.data || {}, me.getValue());
            if (result._id) {

            } else {
                result._id = JSGetCommonKey(false);
                me.getComponent('_id').setValue(result._id);
            }
            me.getComponent('_id').setValue(result._id)
            return result;
        }
    },
    diySetValue: function (data) {
        var me = this;
        //处理可能里面的legend还未渲染完
        me.data = Ext.clone(data);
        setTimeout(function () {
            me.suspendLayouts();
            var disabledBtn = me.legend.getComponent('disabledBtn');
            if (data) {
                if (Ext.isEmpty(data._id)) {
                    data._id = JSGetCommonKey(false);
                }
                me.setValue(data);
                disabledBtn.count = 1;
                disabledBtn.handler();
            } else {
                disabledBtn.count = 0;
                disabledBtn.handler();

            }
            me.resumeLayouts();
            me.updateLayout();
        }, 10)
    },
    initComponent: function () {
        var me = this;
        //现在把旧的shape分成个类，一个时shape和一个ShapeObject，shape不再继承于任何类
        // 新的shape的strokeStyle,fillStyle两个属性提取到shapeObject中
        var mapping = {
            common: ['_id', 'clazz', 'description',/* 'fillStyle', 'strokeStyle', 'rotation', 'effectType', 'visible'*/],
            Path: ['d'],
            Ellipse: ['cx', 'cy', 'rx', 'ry'],
            Circle: ['r', 'cx', 'cy'],
            Rectangle: ['x', 'y', 'width', 'height'],
        };
        var fields = [];
        for (var i in mapping) {
            if (i != 'common') {
                var filedNames = mapping[i];
                filedNames.forEach(function (item) {
                    if (item == 'd') {
                        fields.push({
                            xtype: 'textarea',
                            fieldLabel: i18n.getKey('d'),
                            itemId: 'd',
                            name: 'd',
                            allowBlank: false,
                            minValue: 0
                        })
                    } else {
                        fields.push({
                            xtype: 'numberfield',
                            fieldLabel: i18n.getKey(item),
                            itemId: item,
                            allowBlank: false,
                            name: item,
                            hidden: true,
                            disabled: true,
                            minValue: 0
                        })
                    }
                })
            }
        }
        me.items = [
            {
                xtype: 'combo',
                itemId: 'clazz',
                name: 'clazz',
                readOnly: me.clazzReadOnly,
                editable: false,
                fieldLabel: i18n.getKey('type'),
                valueField: 'value',
                displayField: 'display',
                value: 'Path',
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: 'Path',
                            display: 'Path'
                        }, {
                            value: 'Ellipse',
                            display: 'Ellipse'
                        }, {
                            value: 'Circle',
                            display: 'Circle'
                        }, {
                            value: 'Rectangle',
                            display: 'Rectangle'
                        }
                    ]
                }),
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var fieldSet = combo.ownerCt;
                        for (var i = 0; i < fieldSet.items.items.length; i++) {
                            var item = fieldSet.items.items[i];
                            if (Ext.Array.contains(mapping['common'], item.itemId)) {
                            } else {
                                try {
                                    if (Ext.Array.contains(mapping[newValue], item.itemId)) {
                                        item.show();
                                        item.setDisabled(false);
                                    } else {
                                        item.hide();
                                        item.setDisabled(true);
                                    }
                                } catch (e) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('不支持的displayObject类型'));
                                }
                            }
                        }
                    }
                }
            },
            {
                name: 'description',
                itemId: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
            },
            {
                name: '_id',
                itemId: '_id',
                hidden: true,
                xtype: 'textfield',
                value: (me.data && !Ext.isEmpty(me.data._id)) ? me.data._id : null,
                fieldLabel: i18n.getKey('id'),
            },
            /*         {
                         name: 'rotation',
                         xtype: 'numberfield',
                         itemId: 'rotation',
                         minValue: 0,
                         hidden: me.onlySubProperty,
                         disabled: me.onlySubProperty,
                         fieldLabel: i18n.getKey('rotation'),
                     },
                     {
                         xtype: 'combo',
                         name: 'effectType',
                         itemId: 'effectType',
                         fieldLabel: i18n.getKey('effectType'),
                         editable: false,
                         valueField: 'value',
                         hidden: me.onlySubProperty,
                         disabled: me.onlySubProperty,
                         displayField: 'display',
                         store: Ext.create('Ext.data.Store', {
                             fields: ['value', 'display'],
                             data: [
                                 {
                                     value: 'Glittering',
                                     display: 'Glittering'
                                 },
                                 {
                                     value: 'Printing',
                                     display: 'Printing'
                                 },
                                 {
                                     value: 'UV',
                                     display: 'UV'
                                 }
                             ]
                         })
                     },*/
            {
                xtype: 'combo',
                name: 'visible',
                itemId: 'visible',
                fieldLabel: i18n.getKey('is') + i18n.getKey('show'),
                editable: false,
                valueField: 'value',
                displayField: 'display',
                value: true,
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: true,
                            display: i18n.getKey('true')
                        },
                        {
                            value: false,
                            display: i18n.getKey('false')
                        }
                    ]
                })
            }
        ];
        for (var i = 0; i < fields.length; i++) {
            me.items.splice(2 + i, 0, fields[i])
        }
        me.callParent();
    }

})
