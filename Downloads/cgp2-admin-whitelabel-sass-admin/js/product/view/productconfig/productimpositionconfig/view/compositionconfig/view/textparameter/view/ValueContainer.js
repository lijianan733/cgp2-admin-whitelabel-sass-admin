/**
 * Created by miao on 2021/6/20.
 */
Ext.define("CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.ValueContainer", {
    extend: "Ext.form.Panel",
    layout: 'vbox',
    allowBlank:true,
    border:0,
    fieldDefaults: {
        labelAlign: 'left',
        labelWidth:120,
        margin:'5',
        msgTarget: 'side',
        validateOnChange: false,
        allowBlank: false
    },
    initComponent: function () {
        var me = this;
        var contentAttributeStore=Ext.data.StoreManager.lookup('contentAttributeStore');
        me.items=[
            {
                xtype: 'radiogroup',
                name: 'clazz',
                columns: 2,
                vertical: true,
                width:'60%',
                items: [
                    { boxLabel: i18n.getKey('FixValue'), name: 'clazz', inputValue: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue' , checked: true},
                    { boxLabel: i18n.getKey('CalculationTemplateValue'), name: 'clazz', inputValue: 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue'}
                ],
                relationComp:['FixValue','CalculationTemplateValue'],
                listeners:{
                    change:function (comp,newValue,oldValue){
                        var valueContainer=comp.ownerCt;
                        comp.relationComp.forEach(function (item){
                            var currentComp=valueContainer.getComponent(item);
                            if(newValue?.clazz.indexOf(currentComp.itemId)>0){
                                currentComp.show();
                                currentComp.enable();
                            }
                            else{
                                currentComp.hide();
                                currentComp.disable()
                            }
                        })
                    }
                }
            },
            {
                xtype: 'textfield',
                name: 'value',
                itemId:'FixValue',
                fieldLabel: i18n.getKey('value'),
                width:500
                // hidden:true,
            },
            {
                xtype: 'fieldcontainer',
                itemId: 'CalculationTemplateValue',
                name: 'calculationExpression',
                fieldLabel: i18n.getKey('value'),
                hidden:true,
                layout: 'hbox',
                width:'100%',
                items:[
                    {
                        xtype: 'textareafield',
                        name: 'calculationExpression',
                        itemId: 'calculationExpression',
                        cols:48,
                        allowBlank: false
                    },
                    {
                        xtype: 'combo',
                        displayField: 'displayName',
                        valueField: 'key',
                        editable: false,
                        itemId: 'field_attr',
                        relativeText:'field_attr',
                        matchFieldWidth: false,
                        haveReset: true,
                        width: 200,
                        store: contentAttributeStore,
                        listeners: {
                            change: function (comp, newValue, oldValue) {
                                var textValue='',textComp=comp.ownerCt.getComponent('calculationExpression');
                                if(newValue){
                                    var skuAttribute =contentAttributeStore.findRecord('key',newValue), paramStr = '';
                                    if (skuAttribute.get('attrOptions')?.length>0) {
                                        paramStr = "lineItems[0].productInstance.productAttributeValueMap['" + newValue + "'].attributeOptionIds";
                                    } else {
                                        paramStr = "lineItems[0].productInstance.productAttributeValueMap['" + newValue + "'].attributeValue";
                                    }
                                    if(newValue == 'qty'){
                                        paramStr = "lineItems[0].qty";
                                    }
                                    textValue=textComp.getValue()+paramStr;
                                    textComp.setValue(textValue);
                                }else{
                                    textComp.setValue(null);
                                }
                            }
                        }
                    }
                ]
            }
        ];

        me.callParent(arguments);
    },
    // listeners: {
    //     afterrender: function (comp) {
    //         if (!Ext.isEmpty(comp.data)) {
    //             comp.setValue(comp.data);
    //         }
    //     }
    // },

    isValid: function () {
        var me = this;
        var isValid = true;
        if(me.allowBlank){
            return true;
        }
        me.items.items.forEach(function (item) {
            if (item.rendered && !item.hidden) {
                if(item.name=='calculationExpression'&&item.getComponent('calculationExpression').isValid() == false){
                    isValid = false;
                }
                else if(item.name!='calculationExpression'&&item.isValid() == false){
                    isValid = false;
                }
            }
        });
        return isValid;
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if(!item.hidden) {
                if(item.name=='calculationExpression'){
                    item.getComponent('calculationExpression').setValue(data[item.name])
                }
                else if(item.name == 'clazz'){
                    item.setValue({'clazz':data[item.name]});
                }
                else{
                    item.setValue(data[item.name])
                }
            }
        })
    },
    getValue: function () {
        var me = this,data={};
        var items = me.items.items;

        Ext.Array.each(items, function (item) {
            if(!item.hidden&&item.name) {
                if (item.name == 'calculationExpression') {
                    data[item.name] = item.getComponent('calculationExpression').getValue();
                }
                else if(item.name == 'clazz'){
                    data[item.name]=item.getValue()?.clazz;
                }
                else{
                    data[item.name] = item.getValue();
                }
            }
        });
        return data;
    }
});
