Ext.define('CGP.finishedproductitem.view.ProduceOperation',{
    extend: 'Ext.form.Panel',
    layout: 'fit',
    border: false,
    width: 200,
    bodyStyle: 'border:none',
    initComponent: function(){
        var me = this;
        var controller = Ext.create('CGP.finishedproductitem.controller.Controller');

        var isOutsourcing = me.isOutsourcing;
        var isNeedPrint = me.isNeedPrint;
        var currentItems = me.currentItems;
        var record = me.record;
        var store = me.store;
        var itemId = record.get('id');

        var printBtn = {
            text: i18n.getKey('print'),
            width: 50,
            itemId: 'printBtn',
            handler: function(){
                var maxValue = parseInt(this.ownerCt.getComponent('noPrint').getValue());
                var title = i18n.getKey('print');
                var statusId = 169033;
                controller.modifyStatusWin(statusId,itemId,store,title,maxValue,me.grid);
            }};


        var tbarItems =[];
        if(isOutsourcing){
            if(Ext.isEmpty(currentItems)){
                tbarItems = [{
                    fieldLabel: i18n.getKey('noReady'),
                    minValue: 0,
                    fieldStyle:'color:red;',
                    xtype: 'displayfield',
                    listeners: {
                        render: function(comp){
                            comp.setValue(me.qty);
                        }
                    },
                    itemId: 'noReady'
                },{
                    text: i18n.getKey('ready'),
                    width: 50,
                    itemId: 'readyBtn',
                    handler: function(){
                        var maxValue = parseInt(this.ownerCt.getComponent('noReady').getValue());
                        var title = i18n.getKey('ready');
                        var statusId = 169032;
                        controller.modifyStatusWin(statusId,itemId,store,title,maxValue,me.grid);
                    }}/*,{
                    fieldLabel: i18n.getKey('readied'),
                    value: '<font color=green>'+0+'</font>',
                    xtype: 'displayfield',
                    itemId: 'ready'
                }*/]
            }else if(!Ext.isEmpty(currentItems) && currentItems[0].status.id == 156202){
                tbarItems = [{
                    fieldLabel: i18n.getKey('noReady'),
                    minValue: 0,
                    fieldStyle:'color:red;',
                    xtype: 'displayfield',
                    listeners: {
                        render: function(comp){
                            comp.setValue(me.qty-currentItems[0].qty);
                        },
                        change: function(comp,newValue,oldValue){
                            if(newValue == 0){
                                comp.setVisible(false);
                                comp.ownerCt.getComponent('readyBtn').setVisible(false);
                            }else{
                                comp.setVisible(true);
                                comp.ownerCt.getComponent('readyBtn').setVisible(true);
                            }
                        }
                    },
                    itemId: 'noReady'
                },{
                    text: i18n.getKey('ready'),
                    width: 50,
                    itemId: 'readyBtn',
                    handler: function(){
                        var maxValue = parseInt(this.ownerCt.getComponent('noReady').getValue());
                        var title = i18n.getKey('ready');
                        var statusId = 169032;
                        controller.modifyStatusWin(statusId,itemId,store,title,maxValue,me.grid);
                    }},{
                    fieldLabel: i18n.getKey('readied'),
                    xtype: 'displayfield',
                    fieldStyle:'color:green;',
                    listeners: {
                        render: function(comp){
                            comp.setValue(currentItems[0].qty);
                        },
                        change: function(comp,newValue,oldValue){
                            if(newValue == 0){
                                comp.setVisible(false);
                                comp.ownerCt.getComponent('re-prepare').setVisible(false);
                            }else{
                                comp.setVisible(true);
                                comp.ownerCt.getComponent('re-prepare').setVisible(true);
                            }
                        }
                    },
                    itemId: 'readied'
                },{
                    text: i18n.getKey('re-prepare'),
                    width: 50,
                    itemId: 're-prepare',
                    handler: function(){
                        var maxValue = parseInt(this.ownerCt.getComponent('readied').getValue());
                        var title = i18n.getKey('re-prepare');
                        var statusId = 169036;
                        controller.modifyStatusWin(statusId,itemId,store,title,maxValue,me.grid);
                    }}]
            }
        }else{
            if(isNeedPrint){
                if(Ext.isEmpty(currentItems)){
                    tbarItems = [{
                        fieldLabel: i18n.getKey('noPrint'),
                        minValue: 0,
                        fieldStyle:'color:red;',
                        xtype: 'displayfield',
                        listeners: {
                            render: function(comp){
                                comp.setValue(me.qty);
                            }
                        },
                        itemId: 'noPrint'
                    },printBtn/*,{
                        fieldLabel: i18n.getKey('printed'),
                        value: '<font color=blue>'+0+'</font>',
                        xtype: 'displayfield',
                        itemId: 'printed'
                    },{
                        text: i18n.getKey('produce'),
                        width: 50,
                        itemId: 'produceBtn',
                        handler: function(){

                        }
                    },{
                        fieldLabel: i18n.getKey('produced'),
                        xtype: 'displayfield',
                        value: '<font color=green>'+0+'</font>',
                        itemId: 'produced'
                    }*/]
                }else if(!Ext.isEmpty(currentItems)){
                    tbarItems = [{
                        fieldLabel: i18n.getKey('noPrint'),
                        minValue: 0,
                        xtype: 'displayfield',
                        fieldStyle:'color:red;',
                        listeners: {
                            render: function(comp){
                                var qty = me.qty;
                                Ext.Array.each(currentItems,function(item){
                                    qty -= item.qty;
                                });
                                comp.setValue(qty);
                            },
                            change: function(comp,newValue,oldValue){
                                if(newValue == 0){
                                    comp.setVisible(false);
                                    comp.ownerCt.getComponent('printBtn').setVisible(false);
                                }else{
                                    comp.setVisible(true);
                                    comp.ownerCt.getComponent('printBtn').setVisible(true);
                                }
                            }
                        },
                        itemId: 'noPrint'
                    },printBtn,{
                        fieldLabel: i18n.getKey('printed'),
                        fieldStyle:'color:blue;',
                        hidden: true,
                        listeners: {
                            render: function(comp){
                                Ext.Array.each(currentItems,function(item){
                                    if(item.status.id == 156203){
                                        comp.setValue(item.qty);
                                    }
                                })
                            },
                            change: function(comp,newValue,oldValue){
                                if(newValue == 0){
                                    comp.setVisible(false);
                                    comp.ownerCt.getComponent('produceBtn').setVisible(false);
                                    comp.ownerCt.getComponent('re-print').setVisible(false);
                                }else{
                                    comp.setVisible(true);
                                    comp.ownerCt.getComponent('produceBtn').setVisible(true);
                                    comp.ownerCt.getComponent('re-print').setVisible(true);
                                }
                            }
                        },
                        xtype: 'displayfield',
                        itemId: 'printed'
                    },{
                        text: i18n.getKey('produce'),
                        width: 50,
                        itemId: 'produceBtn',
                        handler: function(){
                            var maxValue = parseInt(this.ownerCt.getComponent('printed').getValue());
                            var title = i18n.getKey('produce');
                            var statusId = 169031;
                            controller.modifyStatusWin(statusId,itemId,store,title,maxValue,me.grid);
                        }
                    },{
                        text: i18n.getKey('re-print'),
                        width: 50,
                        itemId: 're-print',
                        handler: function(){
                            var maxValue = parseInt(this.ownerCt.getComponent('printed').getValue());
                            var title = i18n.getKey('re-print');
                            var statusId = 169034;
                            controller.modifyStatusWin(statusId,itemId,store,title,maxValue,me.grid);
                        }
                    },{
                        fieldLabel: i18n.getKey('produced'),
                        xtype: 'displayfield',
                        fieldStyle:'color:green;',
                        hidden: true,
                        listeners: {
                            render: function(comp){
                                Ext.Array.each(currentItems,function(item){
                                    if(item.status.id == 156204){
                                        comp.setValue(item.qty);
                                    }
                                })
                            },
                            change: function(comp,newValue,oldValue){
                                if(newValue == 0){
                                    comp.setVisible(false);
                                    comp.ownerCt.getComponent('re-produce').setVisible(false);
                                }else{
                                    comp.setVisible(true);
                                    comp.ownerCt.getComponent('re-produce').setVisible(true);
                                }
                            }
                        },
                        itemId: 'produced'
                    },{
                        text: i18n.getKey('re-produce'),
                        width: 50,
                        hidden: true,
                        itemId: 're-produce',
                        handler: function(){
                            var maxValue = parseInt(this.ownerCt.getComponent('produced').getValue());
                            var title = i18n.getKey('re-produce');
                            var statusId = 169035;
                            controller.modifyStatusWin(statusId,itemId,store,title,maxValue,me.grid);
                        }
                    }]
                }
            }else{
                if(Ext.isEmpty(currentItems)){
                    tbarItems = [{
                        fieldLabel: i18n.getKey('noProduce'),
                        minValue: 0,
                        fieldStyle:'color:red;',
                        xtype: 'displayfield',
                        listeners: {
                            render: function(comp){
                                comp.setValue(me.qty);
                            }
                        },
                        itemId: 'noProduce'
                    },{
                        text: i18n.getKey('produce'),
                        width: 50,
                        itemId: 'produceBtn',
                        handler: function(){
                            var maxValue = parseInt(this.ownerCt.getComponent('noProduce').getValue());
                            var title = i18n.getKey('produce');
                            var statusId = 169031;
                            controller.modifyStatusWin(statusId,itemId,store,title,maxValue,me.grid);
                        }}/*,{
                        fieldLabel: i18n.getKey('produced'),
                        value: '<font color=green>'+0+'</font>',
                        xtype: 'displayfield',
                        itemId: 'produced'
                    }*/]
                }else if(!Ext.isEmpty(currentItems) && currentItems[0].status.id == 156204){
                    tbarItems = [{
                        fieldLabel: i18n.getKey('noProduce'),
                        xtype: 'displayfield',
                        fieldStyle:'color:red;',
                        listeners: {
                            render: function(comp){
                                comp.setValue(me.qty-currentItems[0].qty);
                            },
                            change: function(comp,newValue,oldValue){
                                if(newValue == 0){
                                    comp.setVisible(false);
                                    comp.ownerCt.getComponent('produceBtn').setVisible(false);
                                }else{
                                    comp.setVisible(true);
                                    comp.ownerCt.getComponent('produceBtn').setVisible(true);
                                }
                            }
                        },
                        itemId: 'noProduce'
                    },{
                        text: i18n.getKey('produce'),
                        width: 50,
                        itemId: 'produceBtn',
                        handler: function(){
                            var maxValue = parseInt(this.ownerCt.getComponent('noProduce').getValue());
                            var title = i18n.getKey('produce');
                            var statusId = 169031;
                            controller.modifyStatusWin(statusId,itemId,store,title,maxValue,me.grid);
                        }},{
                        fieldLabel: i18n.getKey('produced'),
                        xtype: 'displayfield',
                        fieldStyle:'color:green;',
                        listeners: {
                            render: function(comp){
                                comp.setValue(currentItems[0].qty);
                            },
                            change: function(comp,newValue,oldValue){
                                if(newValue == 0){
                                    comp.setVisible(false);
                                    comp.ownerCt.getComponent('re-produce').setVisible(false);
                                }else{
                                    comp.setVisible(true);
                                    comp.ownerCt.getComponent('re-produce').setVisible(true);
                                }
                            }
                        },
                        itemId: 'produced'
                    },{
                        text: i18n.getKey('re-produce'),
                        width: 50,
                        itemId: 're-produce',
                        hidden: true,
                        handler: function(){
                            var maxValue = parseInt(this.ownerCt.getComponent('produced').getValue());
                            var title = i18n.getKey('re-produce');
                            var statusId = 169035;
                            controller.modifyStatusWin(statusId,itemId,store,title,maxValue,me.grid);
                        }
                    }]
                }
            }

        }
        me.tbar = [{
            xtype: 'toolbar',
            width: '100%',
            layout: 'column',
            bodyStyle: 'border:none',
            bodyBorder: false,
            border: false,
            columns: 3,
            defaults: {
                width: 100,
                margin: '2 2 2 2',
                labelWidth: 60,
                minValue: 0
            },
            items: tbarItems
        }];
        me.callParent(arguments);
    }
});