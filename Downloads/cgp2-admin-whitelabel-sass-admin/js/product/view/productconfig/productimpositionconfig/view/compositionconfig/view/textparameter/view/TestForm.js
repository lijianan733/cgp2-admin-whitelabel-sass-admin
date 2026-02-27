/**
 * Created by miao on 2021/6/09.
 */
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.TestForm', {
    extend: "Ext.ux.form.ErrorStrickForm",
    width: "100%",
    autoScroll: true,
    scroll: 'vertical',
    border: false,
    bodyStyle: 'padding:10px',
    // padding:'20 900 260 20',
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 120,
        msgTarget: 'side'
    },
    initComponent: function () {
        var me = this;
        var controller=Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.controller.Controller');
        // me.tbar = [
        //     {
        //         text: i18n.getKey('test'),
        //         itemId: 'add',
        //         iconCls: 'icon_test',
        //         handler: function (el) {
        //             var grid = el.ownerCt.ownerCt;
        //             controller.contextWind();
        //         }
        //     }
        // ]
        me.items = [
            {
                xtype: 'fieldcontainer',
                fieldLabel: i18n.getKey('orderData'),
                name: 'orderData',
                layout: 'vbox',
                width: '100%',
                items: [
                    {
                        xtype: 'button',
                        itemId: 'formInput',
                        text: i18n.getKey('form') + i18n.getKey('add'),
                        handler: function (btn) {
                            controller.showOrderData(btn);
                        }
                    },
                    {
                        xtype: 'textareafield',
                        itemId: 'orderData',
                        name: 'orderData',
                        rows: 15,
                        width: 600,
                        allowBlank: false
                    }
                ]
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: i18n.getKey('variableTemplate'),
                name: 'variableTemplate',
                layout: 'vbox',
                width: '100%',
                items: [
                    {
                        xtype: 'textareafield',
                        id:'textVarTemplate',
                        itemId: 'variableTemplate',
                        name: 'variableTemplate',
                        rows: 10,
                        width: 600,
                        allowBlank: false
                    },
                    {
                        xtype: 'toolbar',
                        border:0,
                        items:[
                            {
                                xtype: 'button',
                                itemId: 'formInput',
                                text:i18n.getKey('reflash'),
                                iconCls: 'icon_refresh',
                                handler: function(btn) {
                                    me.setVarTemplate();
                                }
                            },
                            {
                                xtype: 'button',
                                itemId: 'btnTest',
                                text: i18n.getKey('test'),
                                iconCls: 'icon_save',
                                handler: function (comp) {
                                    if (!me.isValid()) {
                                        return false;
                                    }
                                    var mask = me.ownerCt.setLoading();
                                    var data=me.getValue();
                                    data['freemarkerExpression']= controller.variableToFreemark(me.innerParameters)+controller.variabeltoExp(me.innerParameters);
                                    controller.testFreemark(data, mask);
                                }
                            }
                        ]
                    },

                ]
            },

        ];
        me.callParent();
    },
    listeners:{
        afterrender:function (comp){
            comp.setVarTemplate();
        }
    },
    getValue:function (){
        var me=this,data = {};
        Ext.Array.forEach(me.items.items, function (item) {
            if (item.name&&item.xtype=='fieldcontainer') {
                if(item.name=='orderData')
                    data[item.name] = JSON.parse(item.getComponent(item.name).getValue()) ;
                else
                    data[item.name] = item.getComponent(item.name).getValue();
            }
        });
        return data;
    },

    setVarTemplate:function (){
        var me=this;
        var textparameterEditForm = me.ownerCt.getComponent('textparameterEditForm');
        var formData={};
        if(textparameterEditForm.isValid()){
            formData=textparameterEditForm.getValue()
            me.innerParameters=formData.innerParameters;
            var varTemplateComp=Ext.getCmp('textVarTemplate');
            if(varTemplateComp)
                varTemplateComp.setValue(formData?.valueTemplate);
        }
        else{
            Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('Improve and edit form information'))
        }
    }
})
