/**
 * Created by admin on 2019/11/23.
 */
Ext.define('CGP.product.view.bothwayattributemapping.view.ProductAttributeMappingRule',{
    extend: 'Ext.window.Window',
    requires:['Ext.ux.ui.GridPage'],
    modal: true,
    resizable: false,
    width: 1100,
    height: 700,

    initComponent: function () {
        var me = this;
        //me.title=i18n.getKey('product')+i18n.getKey('attribute')+i18n.getKey('mapping')+i18n.getKey('rule');
        me.bbar= [
            '->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_save',
                handler: function (btn) {
                    var form = btn.ownerCt.ownerCt.getComponent('form');
                    if (form.isValid()) {
                        var win = form.ownerCt;
                        var effectedAttributesFieldSet = form.getComponent('effectedAttributesFieldSet');
                        var data= effectedAttributesFieldSet.getValue(),attributeValues=[];
                        if(Ext.isArray(attributeValues)){
                            Ext.Array.each(data,function(item){
                                attributeValues=Ext.Array.merge(attributeValues,item.data);
                            })
                        }
                        if(me.attributeTreePanel.itemId=='left'){
                            me.attributeTreePanel.mappingData.leftValues=attributeValues;
//                            if(Ext.isArray(me.attributeTreePanel.mappingData.leftValues)){
//                                me.attributeTreePanel.mappingData.leftValues=Ext.Array.merge(me.attributeTreePanel.mappingData.leftValues,attributeValues);
//                            }
                        }
                        else{
                            me.attributeTreePanel.mappingData.rightValues=attributeValues;
                        }
                        me.attributeTreePanel.store.getRootNode().removeAll();
                        me.attributeTreePanel.setValue(attributeValues);
                        win.close();
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (btn) {
                    btn.ownerCt.ownerCt.close();
                }
            }
        ];
        me.items = [
            {
                xtype: 'form',
                itemId: 'form',
                autoScroll: true,
                border:false,
                items: [
                    Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.ConstraintOfAttributePropertyArrayFieldSet', {
                        title: '',
                        itemId: 'effectedAttributesFieldSet',
                        id:'mappingRuleEffectedAttFieldSet',
                        layout: {
                            type: 'table',
                            columns: 2
                        },
                        style: {
                            border:0
                        },
                        rightAttributes: me.skuAttributes,
                        valueExchange:true,
                        productId: me.productId,
                        linkShow:true
                    })
                ]
            }
        ];
        me.callParent(arguments);

    }
});
