/**
 * Created by nan on 2021/5/25
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.ConditionFieldV3'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.gridpcstemplateitem.view.BaseInfo', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.baseinfo',
    autoScroll: true,
    createOrEdit: 'create',
    canvasStore: null,
    defaults: {
        allowBlank: false,
        width: 450,
        margin: '5 25 5 25'
    },
    isValidForItems: true,//是否校验时用item.forEach来处理
    title: i18n.getKey('baseInfo'),
    pcsConfigData: null,//pcs源数据
    listeners: {
        afterrender: function () {
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        }
    },
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.diyGetValue) {
                result[item.getName()] = item.diyGetValue();
            } else {
                result[item.getName()] = item.getValue();
            }
        }
        var conditionDTO = me.getComponent('conditionDTO');
        result.condition = conditionDTO.getExpression();
        return result;
    },
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.controller.Controller');
        me.items = [
            {
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            },
            {
                xtype: 'conditionfieldv3',
                name: 'conditionDTO',
                itemId: 'conditionDTO',
                valueType: 'valueEx',//valueEx,和expression两种类型的返回值
                fieldLabel: i18n.getKey('condition'),
                contentData: me.contentData,
                allowBlank: true,
            },
            {
                name: 'selector',
                xtype: 'jsonpathselector',
                fieldLabel: i18n.getKey('selector'),
                itemId: 'selector',
                rootName: 'layers',
                rawData: {
                    layers: me.pcsConfigData.layers
                }
            },
        ];
        me.callParent();
    }
})