/**
 * Created by nan on 2021/4/21.
 */
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.view.UserParams', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    requires: [],
    alias: 'widget.rttypeform',
    defaults: {
        margin: '10 30 10 30'
    },

    initComponent: function () {
        var me = this;
        var controller=Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.controller.Controller');
        me.tbar=Ext.create('Ext.toolbar.Toolbar', {
            items: [
                {
                    itemId: 'btnSave',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function (btn) {
                        var formPanel=btn.ownerCt.ownerCt;
                        var data=formPanel.getValue();
                        controller.saveUserParams(me.impositionId,data);
                    }
                }
            ]
        });
        var rtObjectTree = Ext.create('CGP.materialviewtype.view.TreeField', {
            // fieldLabel: i18n.getKey('userParams'),
            name: 'rtObject',
            itemId: 'userParams'
        });
        me.items=[rtObjectTree];
        me.callParent();
        if(me.impositionId){
            var impositionModel = Ext.ModelManager.getModel('CGP.product.view.productconfig.productimpositionconfig.model.ProductImpositionCfgModel');
            impositionModel.load(Number(me.impositionId), {
                failure: function (record, operation) {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), i18n.getKey('查询异常'));
                },
                success: function (record, operation) {
                    if (record.get('userParams')) {
                        me.data={
                            designType: record.get('userParams'),
                            predesignObject: record.get('userParamDefaultValues')
                        };
                    }
                }
            });
        }
    },
    listeners:{
        afterrender:function (comp){
            if(comp.impositionId&&comp.data){
                comp.setValue(comp.data);
            }
        }
    },
    getValue:function (){
        var me=this;
        var data=me.items.items[0].getSubmitValue();
        if(data){
            return {userParams:data['designType'],userParamDefaultValues:data['predesignObject']}
        }
        else{
            return null;
        }

    },

    setValue:function (data){
        var me=this;
        me.items.items[0].setSubmitValue(data);
    }
})
