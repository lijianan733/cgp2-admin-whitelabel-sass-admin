/**
 * Created by nan on 2020/9/22.
 */
Ext.define("CGP.pagecontentschema.view.TSpanFieldSet", {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.tspanfieldset',
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
            var data = me.getValue();
            for (var i in data) {
                if (Ext.isEmpty(data[i])) {
                    delete data[i];
                }
            }
            return data;
        }
    },
    diySetValue: function (data) {
        var me = this;
        //处理可能里面的legend还未渲染完
        me.data = data;
        me.suspendLayouts();
        var disabledBtn = me.legend.getComponent('disabledBtn');
        if (data) {
            me.setValue(data);
            disabledBtn.count = 1;
            disabledBtn.handler();
        } else {
            disabledBtn.count = 0;
            disabledBtn.handler();

        }
        me.resumeLayouts();
        me.updateLayout();
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'textfield',
                name: 'text',
                itemId: 'text',
                allowBlank: true,
                fieldLabel: i18n.getKey('text')
            },
            {
                xtype: 'numberfield',
                name: 'topMargin',
                itemId: 'topMargin',
                allowBlank: true,
                fieldLabel: i18n.getKey('topMargin')
            },
            {
                xtype: 'numberfield',
                name: 'bottomMargin',
                itemId: 'bottomMargin',
                allowBlank: true,
                fieldLabel: i18n.getKey('bottomMargin')
            },
            {
                xtype: 'numberfield',
                name: 'leftMargin',
                itemId: 'leftMargin',
                allowBlank: true,
                fieldLabel: i18n.getKey('leftMargin')
            },
            {
                xtype: 'numberfield',
                name: 'rightMargin',
                itemId: 'rightMargin',
                allowBlank: true,
                fieldLabel: i18n.getKey('rightMargin')
            },
            {
                xtype: 'stylefieldset',
                name: 'style',
                itemId: 'style',
                title: 'style',
                margin: '0 20 10 20',
                defaults: {
                    allowBlank: true,
                    width: '100%'
                }
            }
        ];
        me.callParent();
    }
})

