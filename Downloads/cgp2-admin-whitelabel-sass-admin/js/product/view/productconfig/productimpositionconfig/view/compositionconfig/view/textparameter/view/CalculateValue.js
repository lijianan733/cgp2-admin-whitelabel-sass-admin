/**
 * Created by miao on 2021/6/09.
 */
Ext.define("CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.CalculateValue", {
    extend: "Ext.form.FieldContainer",
    width:'100%',
    initComponent:function (){
        var me=this;
        me.attrStore=Ext.data.StoreManager.get('skuAttribute')
        me.items=[
            {
                xtype: 'textfield',
                name: 'value',
                fieldLabel: itemData["name"],
                itemId: '',
                labelWidth:80,
                width: 700,
                allowBlank: false
            },
            {
                xtype: 'combo',
                displayField: 'attributeName',
                valueField: 'attributeId',
                editable: false,
                itemId: 'attributeCombo',
                // relativeText: itemData.name + '_field_' + index,
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
                        if(newValue == 'qty'){
                            paramStr = "lineItems[0].qty";
                        }
                        me.getComponent(comp.relativeText).setValue(textValue);
                    }
                }
            }
        ];
        me.callParent(arguments);
    }
});
