/**
 * Created by nan on 2019/1/22.
 */
Ext.define('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.EditItemAttributeForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    requires: ['CGP.product.view.bothwayattributepropertyrelevanceconfig.view.AttributeTreePanel'],
    frame: false,
    record: null,
    itemId: 'editItemAttributeForm',
    autoScroll: true,
    layout: {
        type: 'table',
        columns: 2
    },
    defaults: {
        padding: '10 10 5 15'
    },
    skuAttributes: null,//记录所有使用过的skuAttribute,一个 new Ext.util.MixedCollection()实例
    isValid: function () {
        var me = this;
        this.msgPanel.hide();
        var errors = {};
        var isValid = true;
        var result = me.getFormValue();
        if (result.left.length == 0) {
            errors[i18n.getKey('leftSkuAttribute')] = '不予许为空';
            isValid = false;
        }
        if (result.right.length == 0) {
            errors[i18n.getKey('rightSkuAttribute')] = '不予许为空';
            isValid = false;
        }
        if (isValid == false) {
            this.showErrors(errors);
        }
        return isValid;
    },
    setFormValue: function (leftData, rightData) {
        var me = this;
        var leftAttributeTreePanel = me.getComponent('left');
        var rightAttributeTreePanel = me.getComponent('right');
        leftAttributeTreePanel.setValue(leftData);
        rightAttributeTreePanel.setValue(rightData);
    },
    getFormValue: function () {
        var me = this;
        var leftValue = me.getComponent('left').getValue();
        var rightValue = me.getComponent('right').getValue();
        return {
            left: leftValue,
            right: rightValue
        }
    },
    initComponent: function () {
        var me = this;
        var mask = new Ext.LoadMask(me, {
            msg: "加载中..."
        });
        var controller = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.controller.Controller');
        me.tbar = Ext.create('Ext.ux.toolbar.Edit', {
            btnCreate: {
                hidden: true,
                handler: function () {
                }
            },
            btnCopy: {
                hidden: true
            },
            btnReset: {
                disabled: true
            },
            btnSave: {
                handler: function (view) {
                    var form = view.ownerCt.ownerCt;
                    var isValid = controller.validItemValue(form);
                    if (isValid) {
                        controller.saveItemValue(form);
                    }
                }
            },
            btnGrid: {
                disabled: true
            },
            btnConfig: {
                disabled: true,
                handler: function () {
                }
            },
            btnHelp: {
                handler: function () {
                }
            }
        });
        me.items = [
            Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.AttributeTreePanel', {
                padding: '10 10 10 10',
                title: i18n.getKey('leftSkuAttribute'),
                itemId: 'left',
                height: 350,
                width: 500,
                autoScroll: true,
                id: 'left',
                skuAttributes: me.skuAttributes
            }),
            Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.AttributeTreePanel', {
                padding: '10 10 10 10',
                title: i18n.getKey('rightSkuAttribute'),
                itemId: 'right',
                height: 350,
                autoScroll: true,
                width: 500,
                id: 'right',
                skuAttributes: me.skuAttributes
            })

        ];
        me.callParent();
    }
})
