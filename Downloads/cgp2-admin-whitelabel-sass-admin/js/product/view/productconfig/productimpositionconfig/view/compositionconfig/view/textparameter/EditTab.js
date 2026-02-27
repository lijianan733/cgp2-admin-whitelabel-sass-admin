/**
 * Created by nan on 2021/6/20.
 */
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.EditTab', {
    extend: 'Ext.tab.Panel',
    region: 'center',
    parameterId:null,
    initComponent: function () {
        var me = this;
        me.parameterId = parseInt(JSGetQueryString('parameterId')) ?? 0;
        me.items = [
            Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.Edit',{
                itemId:'textparameterEditForm',
                title:i18n.getKey('baseInfo'),
                width:"100%",
                parameterId:me.parameterId
            }),
            // Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.TestForm', {
            //     itemId: 'testFormTab',
            //     title: i18n.getKey('testForm'),
            //     // closable: true,
            //     width:'100%'
            // })
        ];
        me.callParent();

    }
})
