Ext.define('CGP.tools.freemark.template.view.TestTab', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    layout: {
        type: 'table',
        columns: 1
    },
    fieldDefaults: {
        labelAlign: 'right',
        width: 600,
        labelWidth: 120,
        msgTarget: 'side'
    },
    autoScroll: true,
    scroll: 'vertical',
    border: false,
    padding: '10',

    defaultVariateStore:null,

    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.tools.freemark.template.controller.Controller');
        me.defaultVariateStore = Ext.data.StoreManager.get('defaultVariateStore');
        me.items = [
            {
                xtype: 'fieldcontainer',
                fieldLabel: i18n.getKey('orderData'),
                name: 'orderData',
                layout: 'vbox',
                items: [
                    {
                        xtype: 'button',
                        itemId: 'formInput',
                        text: i18n.getKey('form') + i18n.getKey('add'),
                        handler: function (btn) {
                            var controller = Ext.create('CGP.tools.freemark.template.controller.Controller');
                            controller.orderDataForm(btn);
                        }
                    },
                    {
                        xtype: 'textareafield',
                        itemId: 'orderData',
                        name: 'orderData',
                        rows: 15,
                        width: '100%',
                        allowBlank: false
                    }
                    ]
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: i18n.getKey('variableTemplate'),
                name: 'variableTemplate',
                layout: 'vbox',
                items: [
                    {
                        xtype: 'textareafield',
                        id:'textVarTemplate',
                        itemId: 'variableTemplate',
                        name: 'variableTemplate',
                        rows: 10,
                        width: '100%',
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
                                    var information = me.ownerCt.getComponent('information');
                                    //var testTab = me.getComponent('testTab');
                                    if (!me.isValid()) {
                                        return false;
                                    }
                                    var mask = me.ownerCt.setLoading();
                                    var data=me.getValue();
                                    data['freemarkerExpression']= information.getExpression()
                                    controller.testFreemark(data, mask);
                                }
                            }
                        ]
                    },

                ]
            },

        ];
        // me.bbar = [
        //     '->',
        //     {
        //         xtype: 'button',
        //         itemId: 'btnTest',
        //         text: i18n.getKey('test'),
        //         handler: function () {
        //             var information = me.ownerCt.getComponent('information');
        //             if (!me.isValid()) {
        //                 return false;
        //             }
        //             var mask = me.setLoading();
        //             var data = {freemarkerExpression: information.getExpression()};
        //             Ext.Array.forEach(me.items.items, function (item) {
        //                 if (item.name) {
        //                     data[item.name] = item.getValue();
        //                 }
        //             });
        //             controller.testFreemark(data, mask);
        //         }
        //     }
        // ];
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
        var information = me.ownerCt.getComponent('information');
        var variableComp = information.getComponent('items');
        var variables = null, freemarkExp = '';
        var varKeys=[],varTemplate='';
        var controller = Ext.create('CGP.tools.freemark.template.controller.Controller');
        if (!variableComp.isVisible()) {
            return false;
        }
        variables = variableComp.getSubmitValue();
        varTemplate=controller.getResultTemplate(variables);
        var varTemplateComp=Ext.getCmp('textVarTemplate');
        if(varTemplateComp)
            varTemplateComp.setValue(varTemplate);
    }
});