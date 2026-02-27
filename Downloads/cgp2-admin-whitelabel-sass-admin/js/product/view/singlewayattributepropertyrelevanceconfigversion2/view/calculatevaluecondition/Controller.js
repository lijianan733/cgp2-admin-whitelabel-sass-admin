/**
 * Created by admin on 2020/8/19.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.Controller', {
    inputWind:function(grid,record,leftAttributes){
        var data=Ext.isEmpty(record)?null:record.data;
        var leftAttributes=null;
        var wind=Ext.create("Ext.window.Window",{
            itemId: "inputKeyWind",
            title: i18n.getKey('inputKeys'),
            modal: true,
            layout: 'fit',
            width:900,
            height:600,
            items:[
                Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.view.InputKeys',{
                    itemId:'inputKeyForm',
                    data:data,
                    leftAttributes:leftAttributes
                })
            ],
            bbar:[
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var parentComp=btn.ownerCt.ownerCt;
                        var comitData=null;
                        if(parentComp.getComponent('inputKeyForm').isValid()){
                            comitData=wind.getComponent('inputKeyForm').getValue();
                        }
                        if(Ext.isEmpty(record)){
                            grid.store.add(comitData);
                        }
                        else{
                            for(var key in comitData){
                                if(key!='_id'){
                                    record.set(key,comitData[key]);
                                }
                            }
                        }
                        parentComp.close();
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        wind.close();
                    }
                }
            ]
        });
        wind.show();
    },

    valueConditionWind:function(grid,record,leftAttributes){
        var wind=Ext.create("Ext.window.Window",{
            itemId: "valueConditionWind",
            title: i18n.getKey('valueCondition'),
            modal: true,
            layout: 'fit',
            width:900,
            height:600,
            items:[
                Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.view.KeysValueCondition',{
                    data:record.data,
                    itemId:'valueCondition',
                    leftAttributes:leftAttributes
                })
            ],
            bbar:[
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var parentComp=btn.ownerCt.ownerCt;
                        var comitData=null;
                        if(parentComp.getComponent('valueCondition').isValid()){
                            comitData=wind.getComponent('valueCondition').getValue();
                        }
                        if(record.get('isAdd')){
                            grid.store.add(comitData);
                        }
                        else{
                            for(var key in comitData){
                                if(key!='_id'){
                                    record.set(key,comitData[key]);
                                }
                            }
                        }

                        parentComp.close();
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        wind.close();
                    }
                }
            ]
        });
        wind.show();
    },

    conditionCheckWind:function(record,leftAttributes){
        Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.view.ConditionCheck',{
            itemId: "conditionCheckWind",
            title: i18n.getKey('condition'),
            modal: true,
            layout: 'fit',
            width:900,
            height:600,
            leftAttributes:leftAttributes,
            data:record.data
        }).show();

    }
})