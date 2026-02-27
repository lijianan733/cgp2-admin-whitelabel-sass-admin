/**
 * ReteatValueEx
 * @Author: miao
 * @Date: 2021/12/10
 */
Ext.define("CGP.virtualcontainerobject.view.argumentbuilder.RepeatValueEx", {
    extend: "Ext.ux.form.ErrorStrickForm",
    alias: 'widget.repeatvalueex',
    // layout: 'fit',
    autoScroll: false,
    bodyStyle: "overflow-x:hidden;overflow-y:hidden;border-color:silver;border-top:1;",
    itemId: 'conditionsForm',
    // border: 0,
    fieldDefaults: {
        allowBlank: false
    },

    isValid: function () {
        this.msgPanel.hide();
        var errors = {};
        var isValid = true;
        var validExpressionContainer = this.items.items[0];
        validExpressionContainer.items.items.forEach(function (f) {
            if (f.xtype == 'uxfieldcontainer') {
                if (!f.isValid()) {
                    isValid = false;
                    errors[f.getFieldLabel()] = '不允许为空';
                }
            } else {
                if (!f.isValid()) {
                    isValid = false;
                    errors[f.getFieldLabel()] = f.getErrors();
                }
            }

        });
        isValid ? null : this.showErrors(errors);
        return isValid;
    },
    initComponent: function () {
        var me = this;

        var validExpressionContainer = me.validExpressionContainer = Ext.create('CGP.common.valueExV3.view.ValidExpressionContainer', Ext.Object.merge({
                itemId: JSGetUUID(),
                name: JSGetUUID(),
                readOnly: me.readOnly,
                gridConfigRenderTo: JSGetUUID(),
                isCanUseTemplate: me.isCanUseTemplate,
                uxTextareaContextData: me.uxTextareaContextData,
                defaultResultType: me.defaultResultType,
                expressionConfig: me.expressionConfig,
                defaultClazz: me.defaultClazz,
                defaults: {
                    labelAlign: 'right',
                    allowBlank: false,
                    width: 650,
                    margin: '5',
                    msgTarget: 'side'
                },
                //configurableId: configurableId
            }, me.validExpressionContainerConfig)
        );

        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                itemId: 'saveBtn',
                handler: function (btn) {
                    var centerPanel = btn.ownerCt.ownerCt;
                    if (Ext.isEmpty(centerPanel.rtAttribute)) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请先选择左侧要赋值的属性'));
                        return false;
                    }
                    if (centerPanel.isValid()) {
                        var data = centerPanel.getValue();
                        centerPanel.rtAttribute['conditionValue'] = data;
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('已保存到当前页面'));
                    }
                }
            }
        ];
        me.items = [
            // {
            //     xtype:'panel',
            //     bodyStyle: 'border-width: 1px 0 0 0;',
            //     flex: 1,
            // },
            validExpressionContainer];
        me.callParent(arguments);
    },
    getValue: function () {
        var me = this;
        var data = {
            "clazz": "com.qpp.cgp.domain.pcresource.virtualcontainer.ExpressionValue",
            "valueEx": {
                "clazz": "com.qpp.cgp.value.ExpressionValueEx",
                'constraints': [],
                'expression': {
                    "clazz": "com.qpp.cgp.expression.Expression",
                    "expressionEngine": "JavaScript",
                    "inputs": [],
                    "expression": '',
                    "resultType": "Array",
                    "promptTemplate": ""
                }
            }
        }
        data['valueEx']['expression'] = me.items.items[0].getValidExpressionContainerValue();
        return data;
    },
    refreshData: function (data) {
        var me = this;
        me.rtAttribute = data || {};
        if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
            return false;
        }
        if (Ext.isEmpty(data.conditionValue) || data.conditionValue.length < 1) {
            data.conditionValue = {
                "clazz": "com.qpp.cgp.domain.pcresource.virtualcontainer.ExpressionValue",
                "valueEx": {
                    "clazz": "com.qpp.cgp.value.ExpressionValueEx",
                    "constraints": [],
                    "expression": {
                        "clazz": "com.qpp.cgp.expression.Expression",
                        "resultType": "String",
                        "expressionEngine": "JavaScript",
                        "inputs": [],
                        "expression": "",
                        "promptTemplate": "",
                        "multilingualKey": "com.qpp.cgp.expression.Expression"
                    }
                }
            }
        }
        me.items.items[0].setValidExpressionContainerValue(data.conditionValue?.valueEx?.expression);
    }
});