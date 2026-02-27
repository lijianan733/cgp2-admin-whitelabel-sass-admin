Ext.Loader.syncRequire([
    'CGP.common.expressionfield.ExpTextField'
]);
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.SelectorMappingSet", {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.selectormappingset',

    defaults: {
        allowBlank: true,
        msgTarget: 'side',
        width: '100%',
        labelWidth: 105,
        labelAlign: 'right',
        margin: '5 0 5 0'
    },
    initComponent: function () {
        var me = this;

        me.items = [
            {
                name: 'leftSelector',
                xtype: 'exptext',
                allowBlank: false,
                fieldLabel: i18n.getKey('leftSelector'),
                itemId: 'leftSelector'
            },
            {
                name: 'rightSelector',
                xtype: 'exptext',
                fieldLabel: i18n.getKey('rightSelector'),
                allowBlank: false,
                itemId: 'rightSelector'
            }
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var items = me.items.items, result = {},value=[];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            result[item.name]=item.diyGetValue();
        }
        //转换成数组保存
        value.push(result)
        return value;
    },
    setValue: function (arrData) {
        var me = this,data=null;
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.controller.Controller');
        if(Ext.isArray(arrData)&&arrData.length>0){
            data=arrData[0];
        }
        else {
            return false;
        }
        if(Ext.isEmpty(data)){
            return false;
        }
        var items = me.items.items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.diySetValue(data[item.name]);
        }
    }
})