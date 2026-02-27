/**
 * Created by admin on 2020/8/21.
 */
Ext.define("CGP.tools.freemark.template.view.KeysValue", {
    extend: 'Ext.form.Panel',
    border: 0,
    layout: {
        type: 'table',
        columns: 2
    },
    initComponent: function () {
        var me = this;
        me.attrStore = Ext.create('CGP.common.store.ProductAttributeStore', {
            productId: me.productId
        });
        me.items = [];
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
        Ext.Array.each(data, function (item, index) {
            me.createKeyRecord(item, index);
        })
    },
    getValue: function () {
        var me = this;
        var items = me.items.items;
        var data = [];
        Ext.Array.each(items, function (item) {
            if(item.xtype!='combo'){
            var itemData = {};
            itemData["name"] = item.name;
            itemData["value"] = item.getValue();
            data.push(itemData);
            }
        });
        return data;
    },
    createKeyRecord: function (itemData, index) {
        var me = this;
        var items = me.items.items;
        var item = {
            xtype: 'textfield',
            name: itemData["name"],
            value: itemData["value"],
            fieldLabel: itemData["name"],
            itemId: itemData.name + '_field_' + index,
            labelAlign:'left',
            labelWidth:80,
            width: 686,
            allowBlank: false
        };
        me.add(item);
        var attrItem = {
            xtype: 'combo',
            displayField: 'attributeName',
            valueField: 'attributeId',
            editable: false,
            itemId: itemData.name + '_field_attr' + index,
            relativeText: itemData.name + '_field_' + index,
            matchFieldWidth: false,
            haveReset: true,
            store: me.attrStore,
            listeners: {
                change: function (comp, newValue, oldValue) {
                    var skuAttribute =me.attrStore.findRecord('attributeId',newValue), textValue = '';
                    if (skuAttribute.get('attribute').options.length > 0) {
                        textValue = "lineItems[0].productInstance.productAttributeValueMap['" + skuAttribute.get('attributeId') + "'].attributeOptionIds";
                    } else {
                        textValue = "lineItems[0].productInstance.productAttributeValueMap['" + skuAttribute.get('attributeId') + "'].attributeValue";
                    }
                    me.getComponent(comp.relativeText).setValue(textValue);
                }
            }
        };
        me.add(attrItem);
        //return item;
    }
})