/**
 * Created by miao on 2021/10/11.
 */
Ext.define("CGP.virtualcontainerobject.view.argumentbuilder.BuilderArgument", {
    extend: 'Ext.panel.Panel',
    alias: 'widget.builderargument',
    layout:'border',
    rtTypeId:null,
    initComponent: function () {
        var me=this;
        // var spuAttributeTree = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.SpuAttributeLeftTree', {
        //     region: 'west',
        //     itemId: 'leftTree',
        //     header:false,
        //     width: 300
        //
        // });
        // var spuAttributeMappingGrid = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.SpuAttributeMappingCenterGrid', {
        //     region: 'center',
        //     itemId: 'spuAttributeMappingGrid'
        // });
        me.items=[
            {
                xtype:'blefttree',
                itemId: 'leftTree',
                // rtTypeId:133864,
                region:'west',
                header:false,
                width:300,
            },
            // {
            //     xtype: 'conditionvaluegrid',
            //     itemId: 'conditionValueGrid',
            //     region:'center',
            //     allowBlank:false,
            //     rtAttribute: me.rtAttribute,
            // }
            {
                xtype:'outcenterpanel',
                itemId: 'outCenterPanel',
                region:'center',
            }
            // spuAttributeTree,
            // spuAttributeMappingGrid
        ];
        me.callParent(arguments);
    },

    isValid: function () {
        var me = this;
        var isValid = true;
        // if (!me.rendered) {
        //     return isValid
        // }
        // me.items.items.forEach(function (item) {
        //     if (!item.hidden && item.isValid() == false) {
        //         isValid = false;
        //     }
        // });
        return isValid;
    },
    setValue:function (data){
        var me=this;
        me.data = data;
        var leftTree=me.getComponent('leftTree');
        var isRepeat=!me.down('blefttree toolbar [itemId="addRepeat"]').hidden
        isRepeat? leftTree.setValue(data?.map):leftTree.setValue(data?.mappingRules);
    },
    getValue:function (){
        var me=this;
        var data=me.data||{clazz:'com.qpp.cgp.domain.pcresource.virtualcontainer.MapRtObjectBuildConfig'};
        var leftTree=me.getComponent('leftTree');
        data=Ext.merge(data,leftTree.getValue());
        return data;
    }
})
