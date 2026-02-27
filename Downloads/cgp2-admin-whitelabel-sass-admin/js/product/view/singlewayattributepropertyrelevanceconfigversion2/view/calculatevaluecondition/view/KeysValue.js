/**
 * Created by admin on 2020/8/21.
 */
Ext.define("CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.view.KeysValue", {
    extend:'Ext.form.Panel',
    border:0,
    initComponent: function () {
        var me=this;
        me.items=[];
        me.callParent(arguments);
    },
    listeners: {
        afterrender: function (comp) {
            if (!Ext.isEmpty(comp.data)) {
                comp.setValue(comp.data);
            }
        }
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        me.items.items.forEach(function (item) {
            if (item.rendered) {
                if (item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        return isValid;
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(data, function (item,index) {
            me.createKeyRecord(item,index);
        })
    },
    getValue: function () {
        var me = this;
        var items = me.items.items;
        var data=[];
        Ext.Array.each(items, function (item) {
            var itemData={};
            itemData["name"]=item.name;
            itemData["valueExpression"]=item.getValue();
            data.push(itemData);
        });
        return data;
    },
    createKeyRecord:function(itemData,index){
        var me=this;
        var items = me.items.items;
        var item = {
            xtype:'textfield',
            name : itemData["name"],
            value : itemData["valueExpression"],
            fieldLabel : itemData["name"],
            itemId : itemData.name+'field_'+index,
            width: 800,
            allowBlank : false,
            tipInfo : "属性取值:profiles['profileId']['skuAttributeId']['propertyName']+n 示例：profiles['123']['124']['Value']*0.5+profiles['123']['120']['Value']+5, 属性取option的值: profiles['profileId']['skuAttributeId']['Options'][0]['value']-n  示例：profiles['123']['125']['Options'][0]['value']+2",
            emptyText : "profiles['profileId']['skuAttributeId']['propertyName']+n"
        };
        
        me.add(item);
        return item;
    }
})